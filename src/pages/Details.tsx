import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { TwoColLayout } from '../components/TwoColLayout';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a valid mobile number'),
  country: z.string().min(1, 'Please select a country'),
  consent: z.boolean().refine(v => v === true, 'You must agree to continue'),
});

type FormValues = z.infer<typeof schema>;

export default function Details() {
  const { t } = useLang();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  });

  function onSubmit(data: FormValues) {
    localStorage.setItem('pathora_details', JSON.stringify(data));
    navigate('/payment');
  }

  return (
    <TwoColLayout title={t.details.title} caption="Just a few details so we can send you your report." step={4}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '1.75rem' }}>
        {t.details.title}
      </h1>

      <form id="details-form" onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Name */}
        <div>
          <label className="input-label" htmlFor="details-name">{t.details.name}</label>
          <input id="details-name" className={`input${errors.name ? ' error' : ''}`} {...register('name')} placeholder="Ahmed Al Mansoori" autoComplete="name" />
          {errors.name && <p className="input-error">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="input-label" htmlFor="details-email">{t.details.email}</label>
          <input id="details-email" type="email" className={`input${errors.email ? ' error' : ''}`} {...register('email')} placeholder="ahmed@email.com" autoComplete="email" />
          {errors.email && <p className="input-error">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="input-label" htmlFor="details-phone">{t.details.phone}</label>
          <input id="details-phone" type="tel" className={`input${errors.phone ? ' error' : ''}`} {...register('phone')} placeholder="+971 50 123 4567" autoComplete="tel" />
          {errors.phone && <p className="input-error">{errors.phone.message}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="input-label" htmlFor="details-country">{t.details.country}</label>
          <select id="details-country" className={`input${errors.country ? ' error' : ''}`} {...register('country')} style={{ cursor: 'pointer' }}>
            <option value="">Select your country…</option>
            {t.details.countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p className="input-error">{errors.country.message}</p>}
        </div>

        {/* Consent */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: 'rgba(14,124,134,0.05)', borderRadius: 10 }}>
          <input
            type="checkbox"
            id="details-consent"
            {...register('consent')}
            style={{ width: 18, height: 18, marginTop: 2, accentColor: 'var(--color-teal)', cursor: 'pointer', flexShrink: 0 }}
          />
          <label htmlFor="details-consent" style={{ fontSize: '0.875rem', color: 'var(--color-ink)', lineHeight: 1.5, cursor: 'pointer' }}>
            {t.details.consent}
          </label>
        </div>
        {errors.consent && <p className="input-error">{errors.consent.message}</p>}

        <button type="submit" id="details-submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
          {t.details.cta} →
        </button>
      </form>
    </TwoColLayout>
  );
}
