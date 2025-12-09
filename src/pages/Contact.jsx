'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Globe,
    Smartphone,
    Palette,
    Settings,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Send,
    Loader2,
    DollarSign,
    HelpCircle,
    Shield,
    Zap,
    Users,
    Target,
    Handshake,
    Lightbulb,
    Building,
    MapIcon,
    Star,
    Calendar
} from 'lucide-react'

function Contact() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Service Selection
        serviceType: '',
        projectType: '',

        // Step 2: Project Scope
        pages: 1,
        features: [],
        complexity: 'basic',
        timeline: '',

        // Step 3: Additional Requirements
        designIncluded: false,
        contentWriting: false,
        seoOptimization: false,
        maintenance: false,
        hosting: false,

        // Step 4: Contact Details
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',

        // Calculated
        estimatedCost: 0,
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showContactOption, setShowContactOption] = useState(false);

    // Service configurations with pricing
    const serviceConfigs = {
        'website': {
            name: 'Website Development',
            icon: Globe,
            basePrice: 2500,
            pricePerPage: 500,
            projectTypes: [
                { value: 'landing', label: 'Landing Page', multiplier: 0.4 },
                { value: 'business', label: 'Business Website', multiplier: 1 },
                { value: 'ecommerce', label: 'E-commerce', multiplier: 2 },
                { value: 'portfolio', label: 'Portfolio Site', multiplier: 0.6 },
                { value: 'blog', label: 'Blog/Magazine', multiplier: 0.8 },
            ],
            features: [
                { value: 'responsive', label: 'Responsive Design', price: 0 },
                { value: 'cms', label: 'CMS Integration', price: 1500 },
                { value: 'booking', label: 'Booking System', price: 2000 },
                { value: 'payment', label: 'Payment Gateway', price: 1800 },
                { value: 'multilingual', label: 'Multi-language', price: 1200 },
                { value: 'api', label: 'API Integration', price: 2500 },
            ],
        },
        'mobile': {
            name: 'Mobile App Development',
            icon: Smartphone,
            basePrice: 8000,
            pricePerPage: 800,
            projectTypes: [
                { value: 'ios', label: 'iOS Only', multiplier: 1 },
                { value: 'android', label: 'Android Only', multiplier: 1 },
                { value: 'both', label: 'iOS & Android', multiplier: 1.8 },
                { value: 'cross', label: 'Cross-platform', multiplier: 1.4 },
            ],
            features: [
                { value: 'auth', label: 'User Authentication', price: 1500 },
                { value: 'push', label: 'Push Notifications', price: 1200 },
                { value: 'maps', label: 'Maps Integration', price: 1800 },
                { value: 'payment', label: 'In-app Payments', price: 2500 },
                { value: 'social', label: 'Social Media Integration', price: 1000 },
                { value: 'offline', label: 'Offline Mode', price: 2000 },
            ],
        },
        'uiux': {
            name: 'UI/UX Design',
            icon: Palette,
            basePrice: 1500,
            pricePerPage: 300,
            projectTypes: [
                { value: 'wireframe', label: 'Wireframes Only', multiplier: 0.4 },
                { value: 'mockup', label: 'High-Fidelity Mockups', multiplier: 1 },
                { value: 'prototype', label: 'Interactive Prototype', multiplier: 1.3 },
                { value: 'full', label: 'Complete Design System', multiplier: 1.8 },
            ],
            features: [
                { value: 'research', label: 'User Research', price: 1500 },
                { value: 'testing', label: 'Usability Testing', price: 1200 },
                { value: 'branding', label: 'Brand Identity', price: 2000 },
                { value: 'animation', label: 'Micro-interactions', price: 800 },
                { value: 'guidelines', label: 'Style Guide', price: 600 },
            ],
        },
        'custom': {
            name: 'Custom Solution',
            icon: Settings,
            basePrice: 5000,
            pricePerPage: 1000,
            projectTypes: [
                { value: 'saas', label: 'SaaS Platform', multiplier: 2.5 },
                { value: 'crm', label: 'CRM System', multiplier: 2 },
                { value: 'erp', label: 'ERP Solution', multiplier: 3 },
                { value: 'marketplace', label: 'Marketplace', multiplier: 2.2 },
                { value: 'other', label: 'Other Custom', multiplier: 1.5 },
            ],
            features: [
                { value: 'dashboard', label: 'Admin Dashboard', price: 3000 },
                { value: 'analytics', label: 'Analytics System', price: 2500 },
                { value: 'reporting', label: 'Reporting Tools', price: 2000 },
                { value: 'automation', label: 'Workflow Automation', price: 3500 },
                { value: 'integration', label: 'Third-party Integration', price: 2800 },
            ],
        },
    };

    const complexityMultipliers = {
        basic: { label: 'Basic', multiplier: 1, description: 'Simple and straightforward' },
        intermediate: { label: 'Intermediate', multiplier: 1.4, description: 'Moderate complexity' },
        advanced: { label: 'Advanced', multiplier: 2, description: 'Complex with custom features' },
    };

    const additionalServices = {
        designIncluded: { price: 2000, label: 'Professional Design' },
        contentWriting: { price: 1500, label: 'Content Writing' },
        seoOptimization: { price: 1200, label: 'SEO Optimization' },
        maintenance: { price: 500, label: 'Monthly Maintenance (per month)' },
        hosting: { price: 300, label: 'Hosting Setup & Management (per month)' },
    };

    // Calculate estimated cost
    useEffect(() => {
        calculateEstimate();
    }, [formData.serviceType, formData.projectType, formData.pages, formData.features,
    formData.complexity, formData.designIncluded, formData.contentWriting,
    formData.seoOptimization, formData.maintenance, formData.hosting]);

    const calculateEstimate = () => {
        if (!formData.serviceType || !formData.projectType) {
            setFormData(prev => ({ ...prev, estimatedCost: 0 }));
            return;
        }

        const config = serviceConfigs[formData.serviceType];
        const projectTypeConfig = config.projectTypes.find(pt => pt.value === formData.projectType);

        if (!projectTypeConfig) return;

        // Base calculation
        let cost = config.basePrice * projectTypeConfig.multiplier;

        // Add page/screen cost (only if more than 1 page)
        if (formData.pages > 1) {
            cost += (formData.pages - 1) * config.pricePerPage * projectTypeConfig.multiplier;
        }

        // Add features cost
        formData.features.forEach(featureValue => {
            const feature = config.features.find(f => f.value === featureValue);
            if (feature) {
                cost += feature.price;
            }
        });

        // Apply complexity multiplier
        cost *= complexityMultipliers[formData.complexity].multiplier;

        // Add additional services
        Object.keys(additionalServices).forEach(service => {
            if (formData[service]) {
                cost += additionalServices[service].price;
            }
        });

        setFormData(prev => ({ ...prev, estimatedCost: Math.round(cost) }));

        // Show contact option for very large projects
        setShowContactOption(cost > 50000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFeatureToggle = (featureValue) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(featureValue)
                ? prev.features.filter(f => f !== featureValue)
                : [...prev.features, featureValue]
        }));
    };

    const handleServiceSelect = (serviceKey) => {
        setFormData(prev => ({
            ...prev,
            serviceType: serviceKey,
            projectType: '',
            features: [],
            pages: 1,
        }));
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
        // Scroll to form section instead of top
        const formElement = document.getElementById('contact-form');
        if (formElement) {
            const offset = window.innerWidth < 768 ? 100 : 120; // Less offset on mobile
            const elementPosition = formElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        // Scroll to form section instead of top
        const formElement = document.getElementById('contact-form');
        if (formElement) {
            const offset = window.innerWidth < 768 ? 100 : 120; // Less offset on mobile
            const elementPosition = formElement.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        // Simulate form submission
        setTimeout(() => {
            setStatus({
                type: 'success',
                message: `Thank you ${formData.name}! We've received your project request with an estimated budget of $${formData.estimatedCost.toLocaleString()}. We'll get back to you within 24 hours.`,
            });
            setIsSubmitting(false);
            // Don't reset form to show summary
        }, 1500);
    };

    const canProceedStep1 = formData.serviceType && formData.projectType;
    const canProceedStep2 = formData.pages > 0 && formData.timeline;
    const canProceedStep3 = true; // Optional step
    const canSubmit = formData.name && formData.email;

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            content: 'hello@benubina.com',
            link: 'mailto:hello@benubina.com',
            color: 'text-blue-600'
        },
        {
            icon: Phone,
            title: 'Phone',
            content: '+1 (555) 123-4567',
            link: 'tel:+15551234567',
            color: 'text-green-600'
        },
        {
            icon: MapPin,
            title: 'Office',
            content: '123 Tech Street, Silicon Valley, CA 94025',
            link: '#',
            color: 'text-purple-600'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            content: 'Mon - Fri: 9:00 AM - 6:00 PM PST',
            link: '#',
            color: 'text-orange-600'
        },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="min-h-[60vh] flex items-center justify-center relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
                    <div className="flex items-center justify-center mb-6">
                        <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full backdrop-blur-sm border border-white/20">
                            <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                        Let's <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Connect</span>
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                        Ready to transform your ideas into reality? Get in touch with our team of experts and let's create something extraordinary together.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Free Consultation</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">24h Response</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">100% Secure</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get In Touch</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Multiple ways to reach us. Choose what works best for you.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => {
                            const IconComponent = info.icon;
                            return (
                                <a
                                    key={index}
                                    href={info.link}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className={`inline-flex p-3 rounded-xl ${info.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors duration-300 mb-4`}>
                                        <IconComponent className={`w-8 h-8 ${info.color}`} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{info.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{info.content}</p>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 mt-2" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Multi-Step Form Section */}
            <section id="contact-form" className="py-12 sm:py-16 lg:py-24 px-3 sm:px-4 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    {/* Progress Indicator */}
                    <div className="mb-8 sm:mb-12">
                        <div className="flex justify-between items-center max-w-3xl mx-auto">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            {currentStep > step ? '✓' : step}
                                        </div>
                                        <span className={`mt-2 text-xs sm:text-sm font-medium hidden sm:block ${currentStep >= step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                                            }`}>
                                            {step === 1 && 'Service'}
                                            {step === 2 && 'Scope'}
                                            {step === 3 && 'Extras'}
                                            {step === 4 && 'Contact'}
                                        </span>
                                    </div>
                                    {step < 4 && (
                                        <div className={`h-1 flex-1 mx-2 transition-all ${currentStep > step ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 order-1 lg:order-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-600">
                                {status.message && (
                                    <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{status.message}</span>
                                    </div>
                                )}

                                {/* Mobile Price Summary - Shows when there's an estimate */}
                                {formData.estimatedCost > 0 && (
                                    <div className="lg:hidden mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-primary" />
                                                <span className="font-semibold text-gray-900 dark:text-white">Estimate:</span>
                                            </div>
                                            <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                                ${formData.estimatedCost.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Step 1: Service Selection */}
                                    {currentStep === 1 && (
                                        <div className="space-y-6 animate-fade-in-up">
                                            <div>
                                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">What Service Do You Need?</h2>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Select the type of service that best fits your project</p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {Object.entries(serviceConfigs).map(([key, config]) => {
                                                    const IconComponent = config.icon;
                                                    return (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            onClick={() => handleServiceSelect(key)}
                                                            className={`p-6 border-2 rounded-xl text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${formData.serviceType === key
                                                                ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 shadow-md'
                                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 bg-white dark:bg-gray-800'
                                                                }`}
                                                        >
                                                            <div className={`inline-flex p-3 rounded-xl mb-4 ${formData.serviceType === key ? 'bg-primary-200 dark:bg-primary-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                                                <IconComponent className={`w-8 h-8 ${formData.serviceType === key ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                                            </div>
                                                            <h3 className="font-bold text-lg mb-2">{config.name}</h3>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                Starting from <span className="font-semibold text-primary">${config.basePrice.toLocaleString()}</span>
                                                            </p>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {formData.serviceType && (
                                                <div className="space-y-4 pt-4 animate-fade-in-up">
                                                    <label className="label">Select Project Type *</label>
                                                    <div className="grid gap-3">
                                                        {serviceConfigs[formData.serviceType].projectTypes.map((type) => (
                                                            <label
                                                                key={type.value}
                                                                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.projectType === type.value
                                                                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="projectType"
                                                                    value={type.value}
                                                                    checked={formData.projectType === type.value}
                                                                    onChange={handleChange}
                                                                    className="radio radio-primary"
                                                                />
                                                                <span className="ml-3 flex-1 font-medium">{type.label}</span>
                                                                <span className="text-sm text-gray-500">
                                                                    {type.multiplier}x base
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end pt-4 sm:pt-6">
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    disabled={!canProceedStep1}
                                                    className="btn btn-primary w-full sm:w-auto sm:btn-lg group min-h-12 sm:min-h-14"
                                                >
                                                    Continue
                                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Project Scope */}
                                    {currentStep === 2 && formData.serviceType && (
                                        <div className="space-y-6 animate-fade-in-up">
                                            <div>
                                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Define Your Project Scope</h2>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Tell us more about what you need</p>
                                            </div>

                                            <div>
                                                <label className="label">
                                                    Number of Pages/Screens *
                                                    <span className="ml-2 text-primary-600 font-bold">{formData.pages}</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    name="pages"
                                                    min="1"
                                                    max="50"
                                                    value={formData.pages}
                                                    onChange={handleChange}
                                                    className="range range-primary"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>1</span>
                                                    <span>10</span>
                                                    <span>25</span>
                                                    <span>50+</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="label">Features Needed</label>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    {serviceConfigs[formData.serviceType].features.map((feature) => (
                                                        <label
                                                            key={feature.value}
                                                            className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.includes(feature.value)}
                                                                onChange={() => handleFeatureToggle(feature.value)}
                                                                className="checkbox checkbox-primary"
                                                            />
                                                            <span className="ml-3 flex-1 text-sm">{feature.label}</span>
                                                            {feature.price > 0 && (
                                                                <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                                                                    +${feature.price.toLocaleString()}
                                                                </span>
                                                            )}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="label">Project Complexity *</label>
                                                <div className="grid sm:grid-cols-3 gap-3">
                                                    {Object.entries(complexityMultipliers).map(([key, data]) => (
                                                        <label
                                                            key={key}
                                                            className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${formData.complexity === key
                                                                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="complexity"
                                                                value={key}
                                                                checked={formData.complexity === key}
                                                                onChange={handleChange}
                                                                className="hidden"
                                                            />
                                                            <div className="font-bold mb-1">{data.label}</div>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">{data.description}</div>
                                                            <div className="text-sm text-primary-600 dark:text-primary-400 mt-2">{data.multiplier}x</div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="label text-sm sm:text-base">Expected Timeline *</label>
                                                <select
                                                    name="timeline"
                                                    value={formData.timeline}
                                                    onChange={handleChange}
                                                    className="select text-sm sm:text-base h-10 sm:h-12"
                                                    required
                                                >
                                                    <option value="">Select timeline</option>
                                                    <option value="urgent">Urgent (1-2 weeks) - Rush fee may apply</option>
                                                    <option value="normal">Normal (1-2 months)</option>
                                                    <option value="flexible">Flexible (2+ months)</option>
                                                </select>
                                            </div>

                                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
                                                <button type="button" onClick={prevStep} className="btn btn-ghost w-full sm:w-auto sm:btn-lg group order-2 sm:order-1">
                                                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                                    Back
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    disabled={!canProceedStep2}
                                                    className="btn btn-primary w-full sm:w-auto sm:btn-lg group order-1 sm:order-2 min-h-12 sm:min-h-14"
                                                >
                                                    Continue
                                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Additional Services */}
                                    {currentStep === 3 && (
                                        <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
                                            <div>
                                                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-2">Additional Services</h2>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Enhance your project with these optional services</p>
                                            </div>

                                            <div className="space-y-3">
                                                {Object.entries(additionalServices).map(([key, service]) => (
                                                    <label
                                                        key={key}
                                                        className="flex items-start p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name={key}
                                                            checked={formData[key]}
                                                            onChange={handleChange}
                                                            className="checkbox checkbox-primary mt-1"
                                                        />
                                                        <div className="ml-4 flex-1">
                                                            <div className="font-medium">{service.label}</div>
                                                            <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-1">
                                                                +${service.price.toLocaleString()}
                                                                {(key === 'maintenance' || key === 'hosting') && ' /month'}
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>

                                            {showContactOption && (
                                                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg">
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-3xl">💡</div>
                                                        <div>
                                                            <h3 className="font-bold mb-2">Large Project Detected</h3>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                                                Your project estimate is quite substantial. We recommend scheduling a free consultation call to discuss your specific needs and get a more accurate quote.
                                                            </p>
                                                            <a to="mailto:hello@benubina.com" className="btn btn-sm btn-primary">
                                                                Schedule Consultation
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
                                                <button type="button" onClick={prevStep} className="btn btn-ghost w-full sm:w-auto sm:btn-lg group order-2 sm:order-1">
                                                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                                    Back
                                                </button>
                                                <button type="button" onClick={nextStep} className="btn btn-primary w-full sm:w-auto sm:btn-lg group order-1 sm:order-2 min-h-12 sm:min-h-14">
                                                    Continue
                                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Contact Information */}
                                    {currentStep === 4 && (
                                        <div className="space-y-6 animate-fade-in-up">
                                            <div>
                                                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Your Contact Information</h2>
                                                <p className="text-gray-600 dark:text-gray-400">Final step! Let us know how to reach you</p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="label text-sm sm:text-base">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        className="input text-sm sm:text-base h-10 sm:h-12"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="label text-sm sm:text-base">Email *</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john@example.com"
                                                        className="input text-sm sm:text-base h-10 sm:h-12"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="label text-sm sm:text-base">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="+1 (555) 123-4567"
                                                        className="input text-sm sm:text-base h-10 sm:h-12"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="label text-sm sm:text-base">Company</label>
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        placeholder="Your Company"
                                                        className="input text-sm sm:text-base h-10 sm:h-12"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="label text-sm sm:text-base">Additional Details</label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Any specific requirements or questions..."
                                                    className="textarea min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                                                ></textarea>
                                            </div>                                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
                                                <button type="button" onClick={prevStep} className="btn btn-ghost w-full sm:w-auto sm:btn-lg group order-2 sm:order-1">
                                                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={!canSubmit || isSubmitting}
                                                    className="btn btn-primary w-full sm:w-auto sm:btn-lg group order-1 sm:order-2 min-h-12 sm:min-h-14"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-3" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            <span className="text-sm sm:text-base">Submitting...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-sm sm:text-base">Submit Request</span>
                                                            <Send className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Price Summary Sidebar */}
                        <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
                            <div className="card card-body p-4 sm:p-6 sticky top-20 sm:top-24 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 shadow-lg">
                                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Project Estimate
                                </h3>

                                {formData.estimatedCost > 0 ? (
                                    <div className="space-y-4">
                                        <div className="text-center py-4">
                                            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Estimated Cost</div>
                                            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                                                ${formData.estimatedCost.toLocaleString()}
                                            </div>
                                            {showContactOption && (
                                                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                                                    Consultation recommended
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-300 dark:border-gray-600 pt-4 space-y-3">
                                            <div className="text-sm font-medium mb-2">Breakdown:</div>

                                            {formData.serviceType && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {serviceConfigs[formData.serviceType].name}
                                                    </span>
                                                    <span className="font-medium">Base</span>
                                                </div>
                                            )}

                                            {formData.projectType && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Project Type
                                                    </span>
                                                    <span className="font-medium">
                                                        {serviceConfigs[formData.serviceType].projectTypes.find(
                                                            pt => pt.value === formData.projectType
                                                        )?.label}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.pages > 1 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Pages/Screens
                                                    </span>
                                                    <span className="font-medium">{formData.pages}</span>
                                                </div>
                                            )}

                                            {formData.features.length > 0 && (
                                                <div className="text-sm">
                                                    <div className="text-gray-600 dark:text-gray-400 mb-1">Features:</div>
                                                    <ul className="space-y-1 ml-2">
                                                        {formData.features.map(featureValue => {
                                                            const feature = serviceConfigs[formData.serviceType].features.find(
                                                                f => f.value === featureValue
                                                            );
                                                            return (
                                                                <li key={featureValue} className="text-xs flex items-center gap-1">
                                                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                                                    {feature?.label}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            )}

                                            {formData.complexity && formData.complexity !== 'basic' && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Complexity
                                                    </span>
                                                    <span className="font-medium">
                                                        {complexityMultipliers[formData.complexity].label}
                                                    </span>
                                                </div>
                                            )}

                                            {(formData.designIncluded || formData.contentWriting || formData.seoOptimization ||
                                                formData.maintenance || formData.hosting) && (
                                                    <div className="text-sm">
                                                        <div className="text-gray-600 dark:text-gray-400 mb-1">Add-ons:</div>
                                                        <ul className="space-y-1 ml-2">
                                                            {formData.designIncluded && (
                                                                <li className="text-xs flex items-center gap-1">
                                                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                                                    Professional Design
                                                                </li>
                                                            )}
                                                            {formData.contentWriting && (
                                                                <li className="text-xs flex items-center gap-1">
                                                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                                                    Content Writing
                                                                </li>
                                                            )}
                                                            {formData.seoOptimization && (
                                                                <li className="text-xs flex items-center gap-1">
                                                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                                                    SEO Optimization
                                                                </li>
                                                            )}
                                                            {formData.maintenance && (
                                                                <li className="text-xs flex items-center gap-1">
                                                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                                                    Monthly Maintenance
                                                                </li>
                                                            )}
                                                            {formData.hosting && (
                                                                <li className="text-xs flex items-center gap-1">
                                                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                                                    Hosting Management
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                        </div>

                                        <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-300 dark:border-gray-600">
                                            * Final quote may vary based on specific requirements
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                            <Target className="w-12 h-12" />
                                        </div>
                                        <p className="text-sm">
                                            Select your service and project type to see estimated pricing
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Help */}
                            <div className="card card-body p-6">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span>❓</span> Need Help?
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Not sure what to choose? Our team is here to help you find the perfect solution.
                                </p>
                                <div className="space-y-2">
                                    <a to="mailto:hello@benubina.com" className="btn btn-sm btn-outline w-full">
                                        📧 Email Us
                                    </a>
                                    <a to="tel:+15551234567" className="btn btn-sm btn-outline w-full">
                                        📞 Call Us
                                    </a>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="card card-body p-6 text-center">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span>Free Consultation</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span>24h Response Time</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span>No Obligation Quote</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <span className="text-green-600 text-xl">✓</span>
                                        <span>100% Satisfaction</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Let's Build Something Amazing Together
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                        Whether you have a detailed plan or just an idea, we're here to help transform it into reality.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/portfolio" className="btn btn-outline btn-lg">
                            View Our Work
                        </Link>
                        <Link to="/about" className="btn btn-ghost btn-lg">
                            Learn More About Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default Contact
