import React, { useState } from 'react';
import { OfferItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { PROMOTIONAL_OFFERS } from '../../data/mockData';
import { 
  Tag, Sparkles, Copy, Check, ShieldCheck, 
  ArrowRight, ArrowLeft, Percent, Gift, Clock 
} from 'lucide-react';

interface OffersScreenProps {
  onApplyOffer: (promoCode: string) => void;
}

export const OffersScreen: React.FC<OffersScreenProps> = ({ onApplyOffer }) => {
  const { lang, t, isRtl } = useLanguage();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div id="screen-promotional-offers" className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          <span>{t('offersTitle')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('offersSubtitle')}
        </p>
      </div>

      {/* Promotional Cards List */}
      <div className="space-y-4">
        {PROMOTIONAL_OFFERS.map((offer) => {
          const isCopied = copiedCode === offer.promoCode;
          const title = lang === 'ar' ? offer.titleAr : offer.titleFr;
          const desc = lang === 'ar' ? offer.descriptionAr : offer.descriptionFr;
          const tag = lang === 'ar' ? offer.tagAr : offer.tagFr;

          return (
            <div
              key={offer.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md relative overflow-hidden space-y-3.5 hover:shadow-lg transition-all"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  {tag}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-red-500 text-white shadow-xs">
                  <Percent className="w-3 h-3" />
                  <span>-{offer.discountPercentage}%</span>
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* Price comparison */}
              <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block line-through">
                    {offer.originalPrice.toLocaleString()} {t('dzd')}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-emerald-600 font-mono">
                      {offer.discountedPrice === 0
                        ? (lang === 'ar' ? 'مجاناً 0 دج' : 'GRATUIT 0 DA')
                        : `${offer.discountedPrice.toLocaleString()} ${t('dzd')}`}
                    </span>
                  </div>
                </div>

                <div className="text-end text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{lang === 'ar' ? 'صالح لغاية:' : 'Valable jusqu\'au :'} {offer.validUntil}</span>
                </div>
              </div>

              {/* Promo Code Box & Action */}
              <div className="pt-1 flex items-center gap-2">
                {/* Code Pill */}
                <div className="flex-1 bg-blue-50/70 border border-dashed border-blue-300 rounded-xl px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-mono font-black text-xs text-blue-900 tracking-wider">
                      {offer.promoCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(offer.promoCode)}
                    className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">{t('codeCopied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{t('copyCode')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => onApplyOffer(offer.promoCode)}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                >
                  <span>{t('useOfferBtn')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
