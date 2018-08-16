var vertoHandle, vertoConf, currentCall;
var onMemberJoin, onMemberLeave, onMemberExists, OnMemberModify;

const vertoConfig =
{
    login: '1008@confs.tel4b.com',
    passwd: '1Passw0rd!',
    socketUrl: 'wss://confs.tel4b.com:8082',
    ringFile: 'sounds/bell_ring2.wav',
    iceServers: false,
    deviceParams:
    {
        useMic: 'any',
        useSpeak: 'any',
        useCamera: 'any',
    },
    tag: "video",
}

export function init (_onLogin, _onMemberJoin, _onMemberLeave, _onMemberExists, _OnMemberModify) {
    vertoHandle = new jQuery.verto(vertoConfig, {
        onWSLogin: _onLogin,
        onWSClose: onWSClose,
        onMessage: onMessage
    });
    onMemberJoin = _onMemberJoin;
    onMemberExists = _onMemberExists;
    onMemberLeave = _onMemberLeave;
    OnMemberModify = _OnMemberModify;
}

function onWSClose(verto, success)
{
};

export function makeCall(number, name, mail)
{
    // Sets the parameters for the video stream that will be sent to the
    // videoconference.
    // Hint: Use the upKPS result from a bandwidth test to determine the video
    // resolution to send!
    vertoHandle.videoParams(
    {
        // Dimensions of the video feed to send.
        minWidth: 320,
        minHeight: 240,
        maxWidth: 640,
        maxHeight: 480,
        // The minimum frame rate of the client camera, Verto will fail if it's
        // less than this.
        minFrameRate: 15,
        // The maximum frame rate to send from the camera.
        vertoBestFrameRate: 30,
    });
    currentCall = vertoHandle.newCall(
    {
        destination_number: number,
        caller_id_name: name,
        caller_id_number: "1008",
        outgoingBandwidth: "default",
        incomingBandwidth: "default",
        //useStereo: true,
        useVideo:true,
        //useMic: true,
        //useSpeak: true,
        dedEnc: false,
        userVariables:
        {
            avatar: "",
            email: mail
        }
    });
}

export function closeCall()
{
    if(currentCall)
    {
        currentCall.hangup();
    }
}
function sendChat(chatText)
{
    vertoConf.sendChat(chatText, "message");
}

// This translates to the following conference API command:
// conference [conference id] [command] [id] [value]
function sendCommand(command, id, value)
{
    vertoHandle.rpcClient.call("verto.broadcast",
    {
        "eventChannel": vertoConf.params.laData.modChannel,
        "data":
        {
            "application": "conf-control",
            "command": command,
            "id": id,
            "value": value
        }
    });
}

// Receives conference-related messages from FreeSWITCH.
// Note that it's possible to write server-side modules to send customized
// messages via this callback.
function onMessage(verto, dialog, message, data)
{
    switch (message)
    {
        case $.verto.enum.message.pvtEvent:
        if (data.pvtData)
        {
            switch (data.pvtData.action)
            {
                // This client has joined the live array for the conference.
                case "conference-liveArray-join":
                // With the initial live array data from the server, you can
                // configure/subscribe to the live array.
                initLiveArray(verto, dialog, data);
                break;
                // This client has left the live array for the conference.
                case "conference-liveArray-part":
                // Some kind of client-side wrapup...
                break;
            }
        }
        break;
        // TODO: Needs doc.
        case $.verto.enum.message.info:
        break;
        // TODO: Needs doc.
        case $.verto.enum.message.display:
        break;
        case $.verto.enum.message.clientReady:
        // 1.8.x+
        // Fired when the server has finished re-attaching any active sessions.
        // data.reattached_sessions contains an array of session IDs for all
        // sessions that were re-attached.
        break;
    }
}

var initLiveArray = function(verto, dialog, data)
{
    // Set up addtional configuration specific to the call.
    vertoConf = new $.verto.conf(verto,
    {
        dialog: dialog,
        hasVid: true,
        laData: data.pvtData,
        // For subscribing to published chat messages.
        chatCallback: function(verto, eventObj)
        {
            var from = eventObj.data.fromDisplay || eventObj.data.from || 'Unknown';
            var message = eventObj.data.message || '';
            $('#chat.js').onAddChatMessage(from, message);
        },
    });
    var config =
    {
        subParams:
        {
            callID: dialog ? dialog.callID : null
        },
    };
    // Set up the live array, using the live array data received from FreeSWITCH.
    var liveArray = new $.verto.liveArray(verto, data.pvtData.laChannel, data.pvtData.laName, config);
    // Subscribe to live array changes.
    liveArray.onChange = function(liveArrayObj, args)
    {
        log("Call UUID is: " + args.key);
        try
        {
            switch (args.action)
            {
                // Initial list of existing conference users.
                case "bootObj":
                    for (var i = 0; i < args.data.length; i++)
                    {
                        onMemberExists(args.data[i]);
                        //$('#chat.js').onNewMember(args.data[i]);
                    }
                break;

                // New user joined conference.
                case "add":
                    var data = [args.key, args.data];
                    onMemberJoin(data);
                    
                    // $('#chat.js').onAddChatMessage(args.data[2], ' has joined');
                    // $('#chat.js').onNewMember(data);
                break;

                // User left conference.
                case "del":
                    onMemberLeave(args.key);
                    // $('#chat.js').onRemoveMember(args.key);
                break;

                // Existing user's state changed (mute/unmute, talking, floor, etc)
                case "modify":
                    OnMemberModify(args.data);
                    // $('#chat.js').remplaceMember(args.data);
                break;

            }
        }
        catch (err)
        {
            console.error("ERROR: " + err);
        }
    };
    // Called if the live array throws an error.
    liveArray.onErr = function (obj, args)
    {
        console.error("Error: ", obj, args);
    };
}

// USEFULL STUFF
function log(message)
{
    console.log('AVM: ' + message);
}
function getMyCallID()
{
    return currentCall['callID'];
}
$.fn.isModerator = function()
{
    //return sessionStorage.getItem("room").includes("moderator");
}