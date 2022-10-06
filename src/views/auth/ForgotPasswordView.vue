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
                  <h1>Restore Account</h1>
                  <p class="text-medium-emphasis">type registered username or email</p>
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
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" type="submit"> Reset </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <router-link
                          to="/login"
                          v-slot="{href, route, navigate}"
                      >
                        <CButton color="link" class="px-0" :href="href" @click="navigate">
                          Login
                        </CButton>
                      </router-link>
                    </CCol>
                  </CRow>
                </CForm>
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
  name: 'ForgotPasswordView',
  data: () => {
    return {
      validatedCustom: null,
      credentials: {
        username: null
      }
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
      return authStore.restore(this.credentials)
         .catch(error => this.setErrors({ apiError: error }));
    }
  }
}

</script>



