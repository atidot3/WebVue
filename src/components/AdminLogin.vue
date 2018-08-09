<template>
    <div class="Acces">
        <img alt="Vue logo" src="../assets/mooz.png" height="200" width="200">
        <title>Access</title>
        <div id="login">
            <div class="container">
                <div id="login-row" class="row justify-content-center align-items-center">
                    <div id="login-column" class="col-md-6">
                        <div id="login-box" class="col-md-12">
                            <form id="login-form" class="form" @submit.prevent="login">
                                <h3 class="text-center text-info">Admin Login</h3>
                                <div class="form-group">
                                    <label for="email" class="text-info" >Email:</label><br>
                                    <div class="form-group" :class="{ 'form-group--error': $v.email.$error }">
                                        <input type="text" name="email" id="email" class="form-control" v-model="email">
                                        <div class="error alert-warning" role="alert" v-if="!$v.email.required">Field is required</div>
                                        <div class="error alert-danger" role="alert" v-if="!$v.email.email">Please enter valid email format.</div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="password" class="text-info" >Password:</label><br>
                                    <div class="form-group" :class="{ 'form-group--error': $v.password.$error }">
                                        <input type="password" name="password" id="password" class="form-control" v-model="password">
                                        <div class="error alert-warning" role="alert" v-if="!$v.password.required">Field is required</div>
                                        <div class="error alert-danger" role="alert" v-if="!$v.password.minLength">Password must have at least {{$v.password.$params.minLength.min}} letters.</div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="remember-me" class="text-info"><span>Remember me </span>
                                    <span><input id="remember-me" name="remember-me" type="checkbox"></span></label><br>
                                    <button type="submit" :disabled="$v.$invalid" class="btn btn-info btn-md">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'AdminLogin',
  data () {
      return {
        email: '',
        password: ''
      }
  },
  validations:
  {
      email:
      {
          required,
          email
      },
      password:
      {
          required,
          minLength: minLength(8)
      }
  },
  methods:
  {
    login: function()
    {
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
  height: 100%;
  margin-bottom: 60px;
  padding-bottom: 70px;
}
#login .container #login-row #login-column #login-box {
  margin-top: 120px;
  max-width: 600px;
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
