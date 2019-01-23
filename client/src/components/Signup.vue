<template>
  <v-app id="signup">
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm9 md7 lg5>
            <v-card ref="form">
              <v-toolbar color="white" flat>
                <v-toolbar-title>Sign up</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="px-5">
                <v-text-field v-model="username" type="text" label="User name" placeholder="Taras Shevchenko"></v-text-field>
                <v-text-field v-model="email" type="email" label="E-mail" placeholder="taras.shevchenko@automir.com.ua"></v-text-field>
                <v-text-field v-model="password" v-on:blur="showPassword = false" :append-icon="showPassword ? 'visibility_off' : 'visibility'" :type="showPassword ? 'text' : 'password'" label="Password" @click:append="showPassword = !showPassword"></v-text-field>
              </v-card-text>
              <v-divider class="mt-4"></v-divider>
              <v-card-actions class="pa-3">
                <v-btn color="primary" flat>Sign in instead</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submit">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Authentication from '@/services/authentication'

export default {

  data () {
    return {
      username: '',
      email: '',
      password: '',
      showPassword: false
    }
  },

  methods: {

    async submit () {
      try {
        await Authentication.signup({
          username: this.username,
          email: this.email,
          password: this.password
        })
      } catch (error) {
        // error.response.data.error
      }
    }

  }

}
</script>

<style scoped>

</style>
