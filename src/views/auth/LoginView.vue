<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm class="needs-validation"
                       novalidate
                       :validated="validatedCustom"
                       @submit="handleSubmitCustom">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CAlert color="primary" v-if="message">{{ message }}</CAlert>
                  <CInputGroup class="mb-3 has-validation">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                        placeholder="Username"
                        autocomplete="username"
                        v-model="credentials.username"
                        id="validationCustomUsername"
                        required
                    />
                    <CFormFeedback valid></CFormFeedback>
                    <CFormFeedback invalid>type username</CFormFeedback>
                  </CInputGroup>
                  <CInputGroup class="mb-4 has-validation">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                        type="password"
                        placeholder="Password"
                        autocomplete="current-password"
                        v-model="credentials.password"
                        id="validationCustomPassword"
                        required
                    />
                    <CFormFeedback valid></CFormFeedback>
                    <CFormFeedback invalid>type password</CFormFeedback>
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" type="submit"> Login </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <router-link
                          to="/forgot-password"
                          v-slot="{href, route, navigate}"
                      >
                        <CButton color="link" class="px-0" :href="href" @click="navigate">
                          Forgot password?
                        </CButton>
                      </router-link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p></p>
                  <router-link
                      to="/signup"
                      v-slot="{href, route, navigate}"
                  >
                    <CButton color="light" variant="outline" class="mt-3" :href="href" @click="navigate">
                      Register Now!
                    </CButton>
                  </router-link>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
export default {
  name: 'LoginView',
  data: () => {
    return {
      validatedCustom: null,
      credentials: {
        username: null,
        password: null
      },
      message: null
    }
  },
  methods: {
    setErrors(message) {
      console.log(message)
    },
    handleSubmitCustom(event) {
      const form = event.currentTarget
      event.preventDefault()
      event.stopPropagation()

      if (form.checkValidity() === false) {
        this.validatedCustom = false
      }
      const authStore = useAuthStore();
      this.validatedCustom = true
      return authStore.login(this.credentials)
          .then(response => {
            if (response.message) {
              this.message = response.message
              setTimeout(() => {
                this.message = null
              }, 30000)
            }
            if (response.id) {
              this.$router.push({
                path: '/2fa'
              })
            }
          })
         .catch(error => this.setErrors({ apiError: error }));
    }
  }
}

</script>



