<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Validation</strong> <small>Custom styles</small>
        </CCardHeader>
        <CCardBody>
          <p class="text-medium-emphasis small">
            For custom CoreUI form validation messages, you&#39;ll need to add
            the
            <code>novalidate</code> boolean property to your
            <code>&lt;CForm&gt;</code>. This disables the browser default
            feedback tooltips, but still provides access to the form validation
            APIs in JavaScript. Try to submit the form below; our JavaScript
            will intercept the submit button and relay feedback to you. When
            attempting to submit, you&#39;ll see the <code>:invalid</code> and
            <code>:valid</code> styles applied to your form controls.
          </p>
          <p class="text-medium-emphasis small">
            Custom feedback styles apply custom colors, borders, focus styles,
            and background icons to better communicate feedback.
          </p>
          <DocsExample href="forms/validation.html">
            <CForm
              class="row g-3 needs-validation"
              novalidate
              :validated="validatedCustom01"
              @submit="handleSubmitCustom01"
            >
              <CCol :md="4">
                <CFormLabel for="validationCustom01">Email</CFormLabel>
                <CFormInput id="validationCustom01" value="Mark" required />
                <CFormFeedback valid> Looks good! </CFormFeedback>
              </CCol>
              <CCol :md="4">
                <CFormLabel for="validationCustom02">Email</CFormLabel>
                <CFormInput id="validationCustom02" value="Otto" required />
                <CFormFeedback valid> Looks good! </CFormFeedback>
              </CCol>
              <CCol :md="4">
                <CFormLabel for="validationCustomUsername">Username</CFormLabel>
                <CInputGroup class="has-validation">
                  <CInputGroupText id="inputGroupPrepend">@</CInputGroupText>
                  <CFormInput
                    id="validationCustomUsername"
                    value=""
                    aria-describedby="inputGroupPrepend"
                    required
                  />
                  <CFormFeedback invalid>
                    Please choose a username.
                  </CFormFeedback>
                </CInputGroup>
              </CCol>
              <CCol :md="6">
                <CFormLabel for="validationCustom03">City</CFormLabel>
                <CFormInput id="validationCustom03" required />
                <CFormFeedback invalid>
                  Please provide a valid city.
                </CFormFeedback>
              </CCol>
              <CCol :md="3">
                <CFormLabel for="validationCustom04">City</CFormLabel>
                <CFormSelect id="validationCustom04">
                  <option disabled>Choose...</option>
                  <option>...</option>
                </CFormSelect>
                <CFormFeedback invalid>
                  Please provide a valid city.
                </CFormFeedback>
              </CCol>
              <CCol :md="3">
                <CFormLabel for="validationCustom05">City</CFormLabel>
                <CFormInput id="validationCustom05" required />
                <CFormFeedback invalid>
                  Please provide a valid zip.
                </CFormFeedback>
              </CCol>
              <CCol :xs="12">
                <CFormCheck
                  id="invalidCheck"
                  type="checkbox"
                  label="Agree to terms and conditions"
                  required
                />
                <CFormFeedback invalid>
                  You must agree before submitting.
                </CFormFeedback>
              </CCol>
              <CCol :xs="12">
                <CButton color="primary" type="submit">Submit form</CButton>
              </CCol>
            </CForm>
          </DocsExample>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
export default {
  name: 'Validation',
  data: () => {
    return {
      validatedCustom01: null,
      validatedDefault01: null,
      validatedTooltip01: null,
    }
  },
  methods: {
    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.validatedCustom01 = true
    },
    handleSubmitDefault01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.validatedDefault01 = true
    },
    handleSubmitTooltip01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.validatedTooltip01 = true
    },
  },
}
</script>
