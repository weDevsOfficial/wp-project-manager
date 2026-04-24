import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@store/index';
import { saveGeneral } from '@store/settingsSlice';
import { useI18n } from '@hooks/useI18n';
import { useToast } from '@hooks/useToast';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { CURRENCIES, COUNTRIES, getInv } from './constants';
import ColorPicker from './parts/ColorPicker';

export default function InvoiceSettingsTab() {
  const { __ } = useI18n();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [isDirty, setIsDirty] = useState(false);

  const [themeColor, setThemeColor] = useState(() => getInv('theme_color', '#82b541'));
  const [currencyCode, setCurrencyCode] = useState(() => getInv('currency_code', 'USD'));
  const [paypalEnabled, setPaypalEnabled] = useState(() => {
    const v = getInv('paypal_status', null) ?? getInv('paypal', false);
    return v === 'on' || v === true || v === 'true';
  });
  const [paypalMail, setPaypalMail] = useState(() => getInv('paypal_email', '') || getInv('paypal_mail', ''));
  const [sandboxMode, setSandboxMode] = useState(() => {
    const v = getInv('paypal_test', null) ?? getInv('sand_box_mode', false);
    return v === true || v === 'true';
  });
  const [paypalInstruction, setPaypalInstruction] = useState(() => getInv('paypal_instruction', ''));
  const [organization, setOrganization] = useState(() => getInv('organization', ''));
  const [address1, setAddress1] = useState(() => getInv('address_line_1', ''));
  const [address2, setAddress2] = useState(() => getInv('address_line_2', ''));
  const [city, setCity] = useState(() => getInv('city', ''));
  const [state, setState] = useState(() => getInv('sate_province', ''));
  const [zip, setZip] = useState(() => getInv('zip_code', ''));
  const [countryCode, setCountryCode] = useState(() => getInv('country_code', 'BD'));

  const [companyName, setCompanyName] = useState(() => getInv('company_name', ''));
  const [companyAddress, setCompanyAddress] = useState(() => getInv('company_address', ''));
  const [taxRate, setTaxRate] = useState(() => getInv('tax_rate', ''));
  const [defaultNotes, setDefaultNotes] = useState(() => getInv('default_notes', ''));

  const [stripeEnabled, setStripeEnabled] = useState(() => {
    const v = getInv('stripe_status', null);
    if (v) return v === 'on' || v === true || v === 'true';
    const gw = getInv('gateWays', []);
    const stripe = Array.isArray(gw) ? gw.find(g => g.name === 'stripe') : null;
    return stripe?.active === true || stripe?.active === 'true';
  });
  const [stripeInstruction, setStripeInstruction] = useState(() => getInv('stripe_instruction', 'Pay with your credit card'));
  const [stripeTestSecret, setStripeTestSecret] = useState(() => {
    const v = getInv('stripe_test_secret', false);
    return v === true || v === 'true';
  });
  const [secretKey, setSecretKey] = useState(() => getInv('secret_key', ''));
  const [secretPublishableKey, setSecretPublishableKey] = useState(() => getInv('secret_publishable_key', ''));
  const [liveSecretKey, setLiveSecretKey] = useState(() => getInv('live_secret_key', ''));
  const [livePublishableKey, setLivePublishableKey] = useState(() => getInv('live_publishable_key', ''));

  const set = useCallback((setter) => (val) => { setter(val); setIsDirty(true); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const invoiceData = {
        theme_color: themeColor,
        currency_code: currencyCode,
        gateWays: [
          { name: 'paypal', label: 'Paypal', active: paypalEnabled },
          { name: 'stripe', label: 'Stripe', active: stripeEnabled },
        ],
        paypal_status: paypalEnabled ? 'on' : 'off',
        paypal_email: paypalMail,
        paypal_test: sandboxMode,
        paypal: paypalEnabled,
        paypal_mail: paypalMail,
        sand_box_mode: sandboxMode,
        paypal_instruction: paypalInstruction,
        stripe_status: stripeEnabled ? 'on' : 'off',
        stripe_instruction: stripeInstruction,
        stripe_test_secret: stripeTestSecret ? 'true' : 'false',
        secret_key: secretKey,
        secret_publishable_key: secretPublishableKey,
        live_secret_key: liveSecretKey,
        live_publishable_key: livePublishableKey,
        company_name: companyName,
        company_address: companyAddress,
        tax_rate: taxRate,
        default_notes: defaultNotes,
        organization,
        address_line_1: address1,
        address_line_2: address2,
        city,
        sate_province: state,
        zip_code: zip,
        country_code: countryCode,
      };
      await dispatch(saveGeneral({ invoice: invoiceData })).unwrap();
      if (PM_Vars.settings) PM_Vars.settings.invoice = invoiceData;
      setIsDirty(false);
      toast.success(__('Invoice settings saved'));
    } catch (err) {
      toast.error(err ?? __('Failed to save'));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold text-pm-text mb-1">{__('Invoice Settings')}</h2>
      <p className="text-sm text-pm-text-muted mb-5">{__('Configure invoice appearance and payment gateways')}</p>

      <div className="rounded-lg border border-pm-border bg-white mb-5">
        <div className="px-5 py-3 bg-muted/30 border-b border-pm-border">
          <h3 className="text-sm font-semibold text-pm-text-primary">{__('Appearance')}</h3>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <div>
            <Label className="text-sm font-medium">{__('Theme Color')}</Label>
            <p className="text-sm text-pm-text-muted mt-0.5">{__('Used for invoice header and accents')}</p>
          </div>
          <ColorPicker value={themeColor} onChange={set(setThemeColor)} />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <Label className="text-sm font-medium">{__('Currency')}</Label>
          </div>
          <Select value={currencyCode} onValueChange={set(setCurrencyCode)}>
            <SelectTrigger className="w-52 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-pm-border bg-white mb-5">
        <div className="px-5 py-3 bg-muted/30 border-b border-pm-border">
          <h3 className="text-sm font-semibold text-pm-text-primary">{__('Payment Gateways')}</h3>
        </div>

        <div className="border-b border-pm-border">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">PP</span>
              </div>
              <div>
                <Label className="text-sm font-semibold">{__('PayPal')}</Label>
                <p className="text-[15px] text-pm-text-muted">{__('Accept payments via PayPal')}</p>
              </div>
            </div>
            <Switch checked={paypalEnabled} onCheckedChange={set(setPaypalEnabled)} />
          </div>
          {paypalEnabled && (
            <div className="px-5 pb-4 pt-0 space-y-3 ml-[52px]">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{__('PayPal Email')}</Label>
                <Input value={paypalMail} onChange={e => set(setPaypalMail)(e.target.value)} className="w-64 h-7 text-sm" placeholder="paypal@example.com" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">{__('Sandbox Mode')}</Label>
                  <p className="text-[13px] text-pm-text-muted">{__('Use demo mode for testing')}</p>
                </div>
                <Switch checked={sandboxMode} onCheckedChange={set(setSandboxMode)} />
              </div>
              <div>
                <Label className="text-sm mb-1 block">{__('PayPal Instruction')}</Label>
                <Textarea value={paypalInstruction} onChange={e => set(setPaypalInstruction)(e.target.value)} className="text-sm" rows={2} />
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">S</span>
              </div>
              <div>
                <Label className="text-sm font-semibold">{__('Stripe')}</Label>
                <p className="text-[15px] text-pm-text-muted">{__('Accept credit card payments via Stripe')}</p>
              </div>
            </div>
            <Switch checked={stripeEnabled} onCheckedChange={set(setStripeEnabled)} />
          </div>
          {stripeEnabled && (
            <div className="px-5 pb-4 pt-0 space-y-3 ml-[52px]">
              <div>
                <Label className="text-sm mb-1 block">{__('Stripe Instruction')}</Label>
                <Textarea value={stripeInstruction} onChange={e => set(setStripeInstruction)(e.target.value)} className="text-sm" rows={2} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">{__('Enable Test Secret Key')}</Label>
                  <p className="text-[13px] text-pm-text-muted">{__('Use sandbox mode for testing')}</p>
                </div>
                <Switch checked={stripeTestSecret} onCheckedChange={set(setStripeTestSecret)} />
              </div>
              {stripeTestSecret ? (
                <>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{__('Test Secret Key')}</Label>
                    <Input value={secretKey} onChange={e => set(setSecretKey)(e.target.value)} className="w-64 h-7 text-sm font-mono" placeholder="sk_test_..." />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{__('Test Publishable Key')}</Label>
                    <Input value={secretPublishableKey} onChange={e => set(setSecretPublishableKey)(e.target.value)} className="w-64 h-7 text-sm font-mono" placeholder="pk_test_..." />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{__('Live Secret Key')}</Label>
                    <Input value={liveSecretKey} onChange={e => set(setLiveSecretKey)(e.target.value)} className="w-64 h-7 text-sm font-mono" placeholder="sk_live_..." />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{__('Live Publishable Key')}</Label>
                    <Input value={livePublishableKey} onChange={e => set(setLivePublishableKey)(e.target.value)} className="w-64 h-7 text-sm font-mono" placeholder="pk_live_..." />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-pm-border bg-white mb-5">
        <div className="px-5 py-3 bg-muted/30 border-b border-pm-border">
          <h3 className="text-sm font-semibold text-pm-text-primary">{__('Invoice Defaults')}</h3>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <div>
            <Label className="text-sm font-medium">{__('Company Name')}</Label>
            <p className="text-sm text-pm-text-muted mt-0.5">{__('Displayed on invoices as the billing entity')}</p>
          </div>
          <Input value={companyName} onChange={e => set(setCompanyName)(e.target.value)} className="w-64 h-8 text-sm" placeholder={__('Your Company Name')} />
        </div>
        <div className="px-5 py-4 border-b border-pm-border">
          <div className="flex items-center justify-between mb-1">
            <div>
              <Label className="text-sm font-medium">{__('Company Address')}</Label>
              <p className="text-sm text-pm-text-muted mt-0.5">{__('Full address shown on invoices')}</p>
            </div>
          </div>
          <Textarea value={companyAddress} onChange={e => set(setCompanyAddress)(e.target.value)} className="text-sm mt-2" rows={3} placeholder={__('123 Main St, Suite 100\nCity, State 12345')} />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <div>
            <Label className="text-sm font-medium">{__('Tax Rate (%)')}</Label>
            <p className="text-sm text-pm-text-muted mt-0.5">{__('Default tax percentage applied to invoices')}</p>
          </div>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={taxRate}
            onChange={e => set(setTaxRate)(e.target.value)}
            className="w-32 h-8 text-sm text-right"
            placeholder="0.00"
          />
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <Label className="text-sm font-medium">{__('Default Notes / Terms')}</Label>
              <p className="text-sm text-pm-text-muted mt-0.5">{__('Automatically included at the bottom of every invoice')}</p>
            </div>
          </div>
          <Textarea value={defaultNotes} onChange={e => set(setDefaultNotes)(e.target.value)} className="text-sm mt-2" rows={4} placeholder={__('Payment is due within 30 days of invoice date.\nThank you for your business.')} />
        </div>
      </div>

      <div className="rounded-lg border border-pm-border bg-white mb-5">
        <div className="px-5 py-3 bg-muted/30 border-b border-pm-border">
          <h3 className="text-sm font-semibold text-pm-text-primary">{__('Organization')}</h3>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <Label className="text-sm font-medium">{__('Organization Name')}</Label>
          <Input value={organization} onChange={e => set(setOrganization)(e.target.value)} className="w-64 h-8 text-sm" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <Label className="text-sm font-medium">{__('Address Line 1')}</Label>
          <Input value={address1} onChange={e => set(setAddress1)(e.target.value)} className="w-64 h-8 text-sm" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <Label className="text-sm font-medium">{__('Address Line 2')}</Label>
          <Input value={address2} onChange={e => set(setAddress2)(e.target.value)} className="w-64 h-8 text-sm" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <Label className="text-sm font-medium">{__('City')}</Label>
          <Input value={city} onChange={e => set(setCity)(e.target.value)} className="w-64 h-8 text-sm" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <Label className="text-sm font-medium">{__('State/Province')}</Label>
          <Input value={state} onChange={e => set(setState)(e.target.value)} className="w-64 h-8 text-sm" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-pm-border">
          <Label className="text-sm font-medium">{__('Zip/Postal Code')}</Label>
          <Input value={zip} onChange={e => set(setZip)(e.target.value)} className="w-40 h-8 text-sm" />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <Label className="text-sm font-medium">{__('Country')}</Label>
          <Select value={countryCode} onValueChange={set(setCountryCode)}>
            <SelectTrigger className="w-52 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!isDirty}>
          {__('Save Changes')}
        </Button>
        {isDirty && (
          <span className="text-sm text-pm-text-muted">
            {__('You have unsaved changes')}
          </span>
        )}
      </div>
    </form>
  );
}
