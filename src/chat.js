(function()
{
	var members = [];
	var myUUID = '';

	function getMyData()
	{
		for (var i = 0; i < members.length; i++)
			if (members[i][0] == myUUID)
				return members[i];
	}
	$.fn.remplaceMember = function(data)
	{
		for (var i = 0; i < members.length; i++)
		{
			if (members[i][1][0] == data[0])
			{
				members[i][1] = data;
				updateData(data);
			}
		}
	}
	function updateData(data)
	{
		var json = JSON.parse(data[4]);

		if (json.audio.talking == true)
		{
			$("#member-gavatar-"+data[0]).attr('class', 'img-circle chat-member-talking');
		}
		else if (json.audio.muted == true)
		{
			$("#member-gavatar-"+data[0]).attr('class', 'img-circle chat-member-muted');
		}
		else
		{
			$("#member-gavatar-"+data[0]).attr('class', 'img-circle');
		}
	}
	function addAdminTool()
	{
		var myself = getMyData();
		var adminPanel = '<div class="admin-controls" id="AdminPanel-'+ myself[1][0] +'">\
			<div class="general-section">\
				<button class="mute-btn" type="button" id="tmute-' + myself[1][0] + '" name="' + myself[1][0] + '">mute</button>\
				<button class="vmute-tbn" type="button" id="vmute-' + myself[1][0] + '" name="' + myself[1][0] + '">mute video</button>\
				<button class="kick-btn" type="button" id="kick-' + myself[1][0] + '" name="' + myself[1][0] + '">kick</button>\
				<button class="deaf-btn" type="button" id="deaf-' + myself[1][0] + '" name="' + myself[1][0] + '">deaf</button>\
				<button class="kick-btn" type="button" id="floor-' + myself[1][0] + '" name="' + myself[1][0] + '">floor</button>\
			</div>\
		</div>';

		$('#member-'+myself[1][0]).append(adminPanel);

		// Button bindings

		// mute / unmute member
		$("#tmute-"+myself[1][0]).on('click', function()
		{
			$('#conference.js').sendCommand('tmute', this.name, null);

			var json = JSON.parse(myself[1][4]);
			if (json.audio.muted == true)
				$("#tmute-"+myself[1][0]).html('mute');
			else
				$("#tmute-"+myself[1][0]).html('unmute');
		});

		// mute unmute video member
		$("#vmute-"+myself[1][0]).on('click', function()
		{
			$('#conference.js').sendCommand('tvmute', this.name, null);

			var json = JSON.parse(myself[1][4]);
			if (json.video.visible == true)
			{
				$("#vmute-"+myself[1][0]).html('unmute video');
			}
			else
			{
				$("#vmute-"+myself[1][0]).html('mute video');
			}
		});

		// kick a member
		$("#kick-"+myself[1][0]).on('click', function()
		{
			$('#conference.js').sendCommand('kick', this.name, null);
		});

		// deaf / undeaf member
		$("#deaf-"+myself[1][0]).on('click', function()
		{
			var json = JSON.parse(myself[1][4]);
			if (json.audio.deaf == true)
			{
				$("#deaf-"+myself[1][0]).html('deaf');
				$('#conference.js').sendCommand('undeaf', this.name, null);
			}
			else
			{
				$("#deaf-"+myself[1][0]).html('undeaf');
				$('#conference.js').sendCommand('deaf', this.name, null);
			}
		});

		// TODO : not working ?????????????????????????????
		$("#floor-"+myself[1][0]).on('click', function()
		{
			var json = JSON.parse(myself[1][4]);
			if (json.audio.deaf == true)
			{
				$("#floor-"+myself[1][0]).html('floor');
				$('#conference.js').sendCommand('unfloor', this.name, null);
			}
			else
			{
				$("#floor-"+myself[1][0]).html('unfloor');
				$('#conference.js').sendCommand('floor', this.name, null);
			}
		});
		// Hide / Show moderation menu
		$("#member-avatar-"+myself[1][0]).on('click', function()
		{
			if (document.getElementById('AdminPanel-'+myself[1][0]).style.display == 'none')
				document.getElementById('AdminPanel-'+myself[1][0]).style.display = 'block';
			else
				document.getElementById('AdminPanel-'+myself[1][0]).style.display = 'none';
		});
	}
	$.fn.onNewMember = function(data)
	{
		members.push(data);
		myUUID = data[0];

		var name = data[1][2];
		var email = data[1][5]['email'];

		var avatar = '<img gravatar-size="40" gravatar-src="::member.email" class="img-circle" id="member-gavatar-' + data[1][0] + '" src="//www.gravatar.com/avatar/44eb0e66c8dbc0a0a6b42c175305aa4f?default=mm&amp;size=40">';
		var member = '<div class="member" id="member-' + data[1][0] + '">' + '<span class="members-avatar" id="member-avatar-' + data[1][0] + '">' + avatar + '</span>' + name + '<small class="ellipsis">' + email + '</small></div>';
		
		// Add some moderation tools (mute - mute camera - kick)

		$('#member-include').append(member);

		if ($('#conference.js').isModerator() == true)
		{
			addAdminTool();
		}
	}
	$.fn.onRemoveMember = function(key)
	{
		var memberID, memberName = '';
		for (var i = 0; i < members.length; i++)
		{
			if (members[i][0] == key)
			{
				memberID = members[i][1][0];
				memberName = members[i][1][2];

				members.splice(i, 1);
			}
		}
		if (memberID != '' && memberName != '')
		{
			var elem = document.getElementById('member-' + memberID);
			elem.parentNode.removeChild(elem);
			$('#conference.js').onAddChatMessage(memberName, ' left');
		}
	}
	$.fn.onAddChatMessage = function(fromName, message)
	{
		$('#chat-include').append('<div class="chat-message">' + fromName + ': ' + '<div class="message">' + message + '</div></div>');
	}
	$(document).ready(function()
	{
		$('#chat-send').on('click', function()
		{
			var chatText = document.getElementById("chat-text").value;
			console.log(chatText);
			if (chatText != null && chatText != '')
			{
				$('#conference.js').sendChat(chatText);
				document.getElementById("chat-text").value = '';
			}
			else
				alert('Can\'t be null');
		});
		$('#member-list').on('click', function()
		{
			document.getElementById('chat').style.display = 'none';
			document.getElementById('members').style.display = 'block';
		});
		$('#chat-view').on('click', function()
		{
			document.getElementById('chat').style.display = 'block';
			document.getElementById('members').style.display = 'none';
		});
		document.getElementById('chat').style.display = 'block';
		document.getElementById('members').style.display = 'none';
	});
})();