'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const ContactForm = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const services = [
    'Large Format Printing',
    'Digital Printing',
    'Offset Printing',
    'Signage Solutions',
    'Vehicle Branding',
    'Exhibition Graphics',
    'Promotional Materials',
    'Packaging Solutions',
    'Custom Fabrication',
    'Installation Services',
  ];

  const projectTypes = [
    'New Project',
    'Ongoing Support',
    'Rush Order',
    'Consultation',
  ];

  const budgetRanges = [
    'Under MVR 5,000',
    'MVR 5,000 - 15,000',
    'MVR 15,000 - 50,000',
    'MVR 50,000+',
  ];

  const timelines = [
    'Urgent (1-3 days)',
    'Standard (1-2 weeks)',
    'Flexible (2-4 weeks)',
    'Long-term Project',
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please describe your project requirements';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Please provide more details (minimum 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
      });
      setSubmitSuccess(false);
    }, 3000);
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg shadow-card p-8">
        <div className="space-y-6">
          <div className="h-10 bg-muted rounded animate-pulse"></div>
          <div className="h-10 bg-muted rounded animate-pulse"></div>
          <div className="h-10 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="h-12 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-card p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-2">
          Start Your Project
        </h2>
        <p className="text-muted-foreground font-body">
          Fill out the form below and we'll get back to you within 24 hours
        </p>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success rounded-md flex items-start space-x-3">
          <Icon name="CheckCircleIcon" size={24} className="text-success flex-shrink-0 mt-0.5" variant="solid" />
          <div>
            <p className="font-semibold text-success font-headline">Message Sent Successfully!</p>
            <p className="text-sm text-success/80 font-body">
              Thank you for contacting us. We'll respond to your inquiry shortly.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold font-headline text-foreground mb-2">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.name ? 'border-error' : 'border-input'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error font-body flex items-center">
                <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold font-headline text-foreground mb-2">
              Email Address <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.email ? 'border-error' : 'border-input'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error font-body flex items-center">
                <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone and Company Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold font-headline text-foreground mb-2">
              Phone Number <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.phone ? 'border-error' : 'border-input'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300`}
              placeholder="+960 7777777"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error font-body flex items-center">
                <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-semibold font-headline text-foreground mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300"
              placeholder="Your Company"
            />
          </div>
        </div>

        {/* Service Selection */}
        <div>
          <label htmlFor="service" className="block text-sm font-semibold font-headline text-foreground mb-2">
            Service Required <span className="text-primary">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${
              errors.service ? 'border-error' : 'border-input'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300 bg-background`}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
              {errors.service}
            </p>
          )}
        </div>

        {/* Project Type and Budget Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="projectType" className="block text-sm font-semibold font-headline text-foreground mb-2">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300 bg-background"
            >
              <option value="">Select project type</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-semibold font-headline text-foreground mb-2">
              Budget Range
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300 bg-background"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-semibold font-headline text-foreground mb-2">
            Project Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300 bg-background"
          >
            <option value="">Select timeline</option>
            {timelines.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold font-headline text-foreground mb-2">
            Project Details <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 border ${
              errors.message ? 'border-error' : 'border-input'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-body transition-all duration-300 resize-none`}
            placeholder="Please describe your project requirements, including dimensions, quantities, materials, and any specific design needs..."
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold font-headline text-base rounded-md shadow-card hover:bg-hover hover:shadow-interactive hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Icon name="PaperAirplaneIcon" size={20} />
              <span>Send Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;