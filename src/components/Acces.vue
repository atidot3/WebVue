<template>
  <div class="Acces">
    <img alt="Vue logo" src="../assets/mooz.png" height="200" width="200">
    <title>Access</title>
    <div id="login">
        <div class="container">
            <div id="login-row" class="row justify-content-center align-items-center">
                <div id="login-column" class="col-md-6">
                    <div id="login-box" class="col-md-12">
                        <h3 class="text-center text-info" :key="param"> {{ param }} </h3>
                        <form id="login-form" class="form" action="" method="post">
                            <h3 class="text-center text-info">Login</h3>
                            <div class="form-group">
                                <label for="username" class="text-info" >Username:</label><br>
                                <input type="text" name="username" id="username" class="form-control" v-model="username">
                            </div>
                            <div class="form-group">
                                <label for="email" class="text-info">Email:</label><br>
                                <input type="text" name="email" id="email" class="form-control" v-model="email">
                            </div>
                            <div class="form-group">
                                <label for="remember-me" class="text-info"><span>Remember me </span>
                                <span><input id="remember-me" name="remember-me" type="checkbox"></span></label><br>
                                <input type="button" class="btn btn-info btn-md" v-on:click="Login" value="submit">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <br>
        </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, between } from 'vuelidate/lib/validators'

export default {
  name: 'Acces',
  props:
  {
      param: String,
  },
  data () {
      return {
        username: '',
        email: '',
        isError: false,
        errorMsg: []
      }
  },
  validation:
  {
      username:
      {
          required
      },
      email:
      {
          required
      }
  },
  methods:
  {
    Login: function(event)
    {
        
        if (this.username != '' && this.email != '')
        {
            if (this.param != null)
            {
                this.isError = false;
                var json = JSON.parse(atob(this.param));
                if (json)
                {
                    window.alert(JSON.stringify(json));
                }
            }
            else
            {
                this.errorMsg.push("Unauthorized");
                this.isError = true;
            }
        }
        else
        {
            if (this.username == '')
                this.errorMsg.push("Name required");
            if (this.email == '')
                this.errorMsg.push("Mail required");
            this.isError = true;
        }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: #17a2b8;
  height: 100vh;
}
#login .container #login-row #login-column #login-box {
  margin-top: 120px;
  max-width: 600px;
  height: 320px;
  border: 1px solid #9C9C9C;
  background-color: #EAEAEA;
}
#login .container #login-row #login-column #login-box #login-form {
  padding: 20px;
}
#login .container #login-row #login-column #login-box #login-form #register-link {
  margin-top: -85px;
}
</style>
