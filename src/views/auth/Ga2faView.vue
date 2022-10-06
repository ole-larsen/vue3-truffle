<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="3">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>2-FA</h1>
                <div v-if="user.qr">
                  <p class="text-muted">Save this code in safety place!</p>
                  <div class="alert alert-dark" role="alert"><code v-html="user.code" class="highlight"></code></div>
                  <div style="width: 100%; margin: 0 auto;">
                    <qrcode-vue :value="user.qr" style="width: 100%; height: 100%;"></qrcode-vue>
                  </div>
                </div>
                <CAlert color="primary" v-if="message">{{ message }}</CAlert>
                <p class="text-muted">Enter Your Google Authenticator 6-Digit Code</p>
                <CFormInput placeholder="2-FA code"
                            autocomplete=""
                            v-model="user.otp" aria-label="2-FA" />
              </CForm>
            </CCardBody>
            <CCardFooter class="p-4">
              <CRow>
                <CCol col="6">
                  <CButton block color="primary"
                           @keyup.enter="submit()"
                           @click.stop.prevent="submit()"
                           :disabled="disabled2FA"
                  >
                    enter
                  </CButton>
                </CCol>
                <CCol col="6">
                  <CButton block color="danger"
                           @keyup.enter="logout()"
                           @click.stop.prevent="logout()"
                           :disabled="disabledLogout"
                  >
                    logout
                  </CButton>
                </CCol>
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
  import {useAuthStore} from "@/stores/auth";
  import QrcodeVue from 'qrcode.vue'
  export default {
    name: 'Ga2faView',
    data () {
      return {
        authStore: useAuthStore(),
        disabled2FA: false,
        disabledLogout: false,
        user: {
          id:   null,
          qr:   null,
          code: null,
          otp:  null,
        },
        message: null
      }
    },
    mounted () {
      this.message = ''
      // first load for test secret set
      return this.authStore.get2fa()
          .then(response => {
            if (response.qr) {
              this.user.qr = response.qr
              this.user.code = response.code
            }
          })
          .catch(error => this.setErrors({ apiError: error }));
    },
    methods: {
      setErrors(message) {
        console.log(message)
      },
      validate () {
        return this.user.code !== ''
      },
      submit () {
        this.message = ''
        if (this.validate()) {
          this.user.id = (JSON.parse(localStorage.getItem('user'))).id
          return this.authStore.check2fa({code: this.user.code, otp: this.user.otp})
              .then(response => {
                if (response.message) {
                  this.message = response.message
                  setTimeout(() => {
                    this.message = null
                  }, 30000)
                }
                if (response.id) {
                  this.$router.push({
                    name: 'Home'
                  })
                }
              });
        } else {
          this.message = 'no 2FA code'
        }
        return false
      },
      logout () {
        this.user = JSON.parse(localStorage.getItem('user'))
        console.log(this.user)
        // this.$store.dispatch(AUTH_LOGOUT, {user: this.user, url: this.url})
        //     .then(r => {
        //       console.log(r)
        //       if (r.user) {
        //         localStorage.removeItem('access_token')
        //         localStorage.removeItem('token_type')
        //         localStorage.removeItem('user-' + this.user.id)
        //         this.$router.push({
        //           name: 'Login'
        //         })
        //       }
        //     })
        //     .catch(e => {
        //       console.log(e)
        //     })
      }
    },
    components: {
      QrcodeVue,
    },
  }
</script>
