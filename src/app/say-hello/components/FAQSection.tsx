'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface FAQ {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const faqs: FAQ[] = [
    {
      question: 'What printing services do you offer?',
      answer: 'We offer large format printing, signage, vehicle branding, exhibition graphics, and promotional materials.',
    },
    {
      question: 'How long does a typical project take?',
      answer: 'Standard projects take 1-2 weeks. Digital printing is completed in 3-5 days. Rush services available.',
    },
    {
      question: 'Do you provide design services?',
      answer: 'Yes, our in-house design team can help create or modify artwork for your project.',
    },
    {
      question: 'What file formats do you accept?',
      answer: 'We accept PDF, AI, EPS, PSD, and high-resolution JPG/PNG files. We can help with file preparation.',
    },
    {
      question: 'Do you offer installation services?',
      answer: 'Yes, we provide professional installation for signage, vehicle wraps, and large format applications.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-card p-6 md:p-8">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse"></div>
          <div className="h-16 bg-muted rounded animate-pulse"></div>
          <div className="h-16 bg-muted rounded animate-pulse"></div>
          <div className="h-16 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-card p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground font-body">
          Quick answers to common questions
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-card"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface transition-colors duration-300"
            >
              <h3 className="font-semibold font-headline text-foreground pr-4">{faq.question}</h3>
              <Icon
                name="ChevronDownIcon"
                size={24}
                className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-surface border-t border-border">
                <p className="text-muted-foreground font-body">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20 text-center">
        <h3 className="text-xl font-bold font-headline text-foreground mb-2">
          Still Have Questions?
        </h3>
        <p className="text-muted-foreground font-body mb-4">
          Contact us directly for more information.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="tel:+9607592222"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground font-semibold font-headline rounded-md hover:bg-hover hover:shadow-interactive transition-all duration-300"
          >
            <Icon name="PhoneIcon" size={20} />
            <span>Call Us</span>
          </a>
          <a
            href="https://wa.me/9607592222"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-success text-success-foreground font-semibold font-headline rounded-md hover:bg-success/90 hover:shadow-interactive transition-all duration-300"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={20} variant="solid" />
            <span>WhatsApp</span>
          </a>
          <a
            href="mailto:creatic@red.mv"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-card text-foreground border border-border font-semibold font-headline rounded-md hover:bg-surface hover:shadow-card transition-all duration-300"
          >
            <Icon name="EnvelopeIcon" size={20} />
            <span>Email Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;