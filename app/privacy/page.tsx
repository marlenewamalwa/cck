export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '4rem auto', padding: '0 2rem 6rem' }}>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Privacy Policy</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Last updated: January 2025</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[
          {
            title: 'What We Collect',
            body: 'When you create an account, we collect your email address and username. When you submit a brand, we collect the brand information you provide including name, description, website, logo, and category. We also collect basic usage data such as pages visited.',
          },
          {
            title: 'How We Use Your Data',
            body: 'We use your information to operate your account, display your brand listings, and improve the platform. We do not sell your personal data to third parties. We do not send marketing emails without your consent.',
          },
          {
            title: 'Authentication',
            body: 'We use Supabase for authentication. If you sign in with Google, we receive your name and email address from Google. We do not receive or store your Google password.',
          },
          {
            title: 'Cookies',
            body: 'We use essential cookies to keep you logged in. We do not use tracking or advertising cookies. You can disable cookies in your browser settings, but this may affect your ability to log in.',
          },
          {
            title: 'Your Brand Listings',
            body: 'Brand information you submit is publicly visible on the platform. If you want a listing removed or edited, you can do so from your profile or contact us directly.',
          },
          {
            title: 'Data Storage',
            body: 'Your data is stored securely on Supabase infrastructure. We take reasonable technical measures to protect your information from unauthorised access.',
          },
          {
            title: 'Your Rights',
            body: 'You have the right to access, correct, or delete your personal data. To make a request, contact us through the Contact page and we will respond within 7 days.',
          },
          {
            title: 'Third Party Links',
            body: 'Brand listings on Closet Culture link to external websites and Instagram pages. We are not responsible for the privacy practices of those third parties.',
          },
          {
            title: 'Changes to This Policy',
            body: 'We may update this policy from time to time. We will notify users of significant changes via email or a notice on the platform.',
          },
          {
            title: 'Contact',
            body: 'For any privacy-related questions or requests, reach us through the Contact page.',
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ background: 'var(--white)', borderRadius: 12, padding: '1.6rem 2rem', boxShadow: '0 2px 14px rgba(128,7,7,0.05)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.6rem' }}>
              {title}
            </h2>
            <p style={{ fontSize: '0.93rem', color: 'var(--muted)', lineHeight: 1.85 }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}