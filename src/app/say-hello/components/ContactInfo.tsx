import Icon from '../../../components/ui/AppIcon';

interface ContactMethod {
  icon: string;
  label: string;
  value: string;
  href: string;
  description: string;
}

const ContactInfo = () => {
  const contactMethods: ContactMethod[] = [
    {
      icon: 'PhoneIcon',
      label: 'Phone',
      value: '+960 777 7777',
      href: 'tel:+9607777777',
      description: 'Call us during business hours',
    },
    {
      icon: 'EnvelopeIcon',
      label: 'Email',
      value: 'hello@redcreatic.mv',
      href: 'mailto:hello@redcreatic.mv',
      description: 'Send us an email anytime',
    },
    {
      icon: 'ChatBubbleLeftRightIcon',
      label: 'WhatsApp',
      value: '+960 777 7777',
      href: 'https://wa.me/9607777777',
      description: 'Quick response via WhatsApp',
    },
    {
      icon: 'MapPinIcon',
      label: 'Location',
      value: 'Malé, Maldives',
      href: '#map',
      description: 'Visit our office',
    },
  ];

  const businessHours = [
    { day: 'Sunday - Thursday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 2:00 PM' },
    { day: 'Friday', hours: 'Closed' },
  ];

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="bg-card rounded-lg shadow-card p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-6">
          Get In Touch
        </h2>
        <div className="space-y-4">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              className="flex items-start space-x-4 p-4 rounded-md hover:bg-surface transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary group-hover:shadow-interactive transition-all duration-300">
                <Icon
                  name={method.icon as any}
                  size={24}
                  className="text-primary group-hover:text-primary-foreground transition-colors duration-300"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold font-headline text-foreground mb-1">
                  {method.label}
                </h3>
                <p className="text-primary font-body font-medium mb-1">{method.value}</p>
                <p className="text-sm text-muted-foreground font-body">
                  {method.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-card rounded-lg shadow-card p-6 md:p-8">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="ClockIcon" size={24} className="text-primary" />
          <h3 className="text-xl font-bold font-headline text-foreground">Business Hours</h3>
        </div>
        <div className="space-y-3">
          {businessHours.map((schedule) => (
            <div
              key={schedule.day}
              className="flex justify-between items-center py-2 border-b border-border last:border-0"
            >
              <span className="font-medium font-body text-foreground">{schedule.day}</span>
              <span className="text-muted-foreground font-body">{schedule.hours}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-accent/10 rounded-md">
          <p className="text-sm text-accent-foreground font-body flex items-start">
            <Icon name="InformationCircleIcon" size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>
              For urgent printing needs outside business hours, contact us via WhatsApp for
              emergency support.
            </span>
          </p>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-lg shadow-interactive p-6 md:p-8 text-primary-foreground">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-md flex items-center justify-center">
            <Icon name="BoltIcon" size={24} className="text-primary-foreground" variant="solid" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-headline mb-2">Rush Orders Available</h3>
            <p className="font-body mb-4 opacity-90">
              Need something urgently? We offer express printing services for time-sensitive
              projects. Contact us to discuss your deadline.
            </p>
            <a
              href="https://wa.me/9607777777?text=I%20need%20urgent%20printing%20service"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-primary font-semibold font-headline rounded-md hover:bg-gray-100 transition-all duration-300"
            >
              <Icon name="ChatBubbleLeftRightIcon" size={20} variant="solid" />
              <span>Contact for Rush Order</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;