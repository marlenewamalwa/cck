export default function TermsPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '4rem auto', padding: '0 2rem 6rem' }}>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Legal</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '1rem' }}>
          Terms & Conditions
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Last updated: January 2025</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or using Closet Culture, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.',
          },
          {
            title: '2. What Closet Culture Is',
            body: 'Closet Culture is a fashion brand directory. We provide a platform for Kenyan fashion brands to gain visibility and for users to discover them. We are not a marketplace and do not facilitate transactions between buyers and sellers.',
          },
          {
            title: '3. Brand Listings',
            body: 'By submitting a brand, you confirm that you have the right to represent that brand. You are responsible for the accuracy of all information submitted. Closet Culture reserves the right to remove any listing that violates these terms or misrepresents a brand.',
          },
          {
            title: '4. User Accounts',
            body: 'You are responsible for maintaining the confidentiality of your account credentials. You must not share your account or use another person\'s account. We reserve the right to suspend or terminate accounts that violate these terms.',
          },
          {
            title: '5. Content',
            body: 'You retain ownership of content you submit (brand descriptions, logos, images). By submitting content, you grant Closet Culture a non-exclusive licence to display that content on the platform. You must not submit content that is false, misleading, infringing, or harmful.',
          },
          {
            title: '6. Reviews',
            body: 'Reviews submitted on brand pages must be honest and based on genuine experience. We reserve the right to remove reviews that are abusive, fake, or violate these terms.',
          },
          {
            title: '7. Limitation of Liability',
            body: 'Closet Culture is provided as-is. We are not liable for any transactions, disputes, or issues that arise between users and brands. We do not guarantee the accuracy of any brand information listed on the platform.',
          },
          {
            title: '8. Changes to These Terms',
            body: 'We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the new terms.',
          },
          {
            title: '9. Contact',
            body: 'For any questions about these terms, reach us through the Contact page.',
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