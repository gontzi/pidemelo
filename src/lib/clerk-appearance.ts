// Apariencia compartida de Clerk alineada con el sistema "Community-first".
// Se usa en <ClerkProvider> (layout raíz) y en <SignIn>/<SignUp>/<UserProfile>.

export const clerkAppearance = {
  variables: {
    colorPrimary: '#FF5C00',
    colorText: '#151B35',
    colorTextSecondary: '#5C6478',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#151B35',
    colorDanger: '#D64545',
    borderRadius: '0.75rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'rounded-xl border border-[#E4E5E8] shadow-card bg-white',
    headerTitle: 'font-heading font-bold tracking-tight',
    headerSubtitle: 'text-[#5C6478]',
    socialButtonsBlockButton:
      'rounded-lg border border-[#E4E5E8] bg-white shadow-soft hover:bg-[#F7F7F6]',
    formButtonPrimary:
      'rounded-lg bg-[#FF5C00] hover:bg-[#E65300] text-white shadow-brand normal-case font-semibold',
    formFieldInput: 'rounded-lg bg-white border-[#E4E5E8]',
    formFieldLabel: 'font-semibold text-[#151B35]',
    footerActionLink: 'text-[#FF5C00] hover:text-[#E65300] font-semibold',
    identityPreviewEditButton: 'text-[#FF5C00]',
    formResendCodeLink: 'text-[#FF5C00]',
    otpCodeFieldInput: 'rounded-lg',
    dividerLine: 'bg-[#E4E5E8]',
    dividerText: 'text-[#5C6478]',
  },
} as const;
