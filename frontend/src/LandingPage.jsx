import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import HIPAAModal from './components/HIPAAModal';
import {
  FileText,
  Clock,
  Brain,
  CloudLightning,
  Shield,
  Database,
  ArrowRight,
  ChevronDownCircleIcon
} from 'lucide-react';
import { HeroList } from './components/HeroList';
import { InteractiveHoverButton } from "./components/magicui/interactive-hover-button";
import { RippleButton } from "./components/magicui/ripple-button";
import { Ripple } from "./components/magicui/ripple";
import { SparklesText } from "./components/magicui/sparkles-text";
import { Feedback } from './components/FeedBackCard';
import Testimonials from './components/Testimonials';
import { ScratchToReveal } from "./components/magicui/scratch-to-reveal";
import FaqSection from './components/FaqSection';
import PrivacySection from './components/PrivacySection';
import { AuroraText } from "./components/magicui/aurora-text";
import { MagicCard } from "./components/magicui/magic-card";

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      {/* HIPAA Consent Modal */}
      <HIPAAModal />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-white to-blue-900 dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-blue-900 text-black dark:text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-slate-700 bg-white dark:bg-slate-800/50 px-3 py-1 text-sm text-black dark:text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                Medical Imaging Enhanced by AI
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight">
                Diagnose Smarter, <br />
                <SparklesText>
                  <AuroraText>Faster, Better</AuroraText>
                </SparklesText>
              </h1>
              <p className="text-gray-600 dark:text-slate-300 text-lg md:text-xl max-w-md">
                Harness the power of 5 specialized AI models to analyze medical images with unprecedented accuracy and speed.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/upload">
                  <InteractiveHoverButton>Start Diagnosis</InteractiveHoverButton>
                </Link>
                <a href="#features">
                  <RippleButton className='rounded-full'>
                    <span className='flex items-center justify-center gap-2 font-smeibold'>
                      Learn More <ChevronDownCircleIcon className='text-gray-500' />
                    </span>
                  </RippleButton>
                </a>
              </div>
              <div className="pt-6 flex items-center text-black dark:text-slate-400 text-sm">
                <div className="flex -space-x-2 mr-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white">DG</div>
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-medium text-white">SR</div>
                  <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-xs font-medium text-white">SW</div>
                </div>
                CodeBlooded by Deepak, Srinivas, Shovin
              </div>
            </div>
            <div className="hidden md:block relative">
              <HeroList />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Advanced Features</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Spectral AI combines cutting-edge technology with medical expertise to deliver unparalleled diagnostic assistance.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="h-6 w-6 text-blue-600" />,
                title: "5 Specialized AI Models",
                desc: "Purpose-built AI models optimized for specific medical imaging modalities, from brain MRIs to retinal scans.",
                bg: "bg-blue-50"
              },
              {
                icon: <CloudLightning className="h-6 w-6 text-green-600" />,
                title: "LLM-Based Reporting",
                desc: "Natural language reports generated instantly from image analysis, saving hours of documentation time.",
                bg: "bg-green-50"
              },
              {
                icon: <FileText className="h-6 w-6 text-amber-600" />,
                title: "Instant PDF Reports",
                desc: "One-click generation of comprehensive, shareable reports with segmentation visualization.",
                bg: "bg-amber-50"
              },
              {
                icon: <Clock className="h-6 w-6 text-purple-600" />,
                title: "Rapid Processing",
                desc: "Analysis completed in seconds, not hours, enabling faster clinical decision-making.",
                bg: "bg-purple-50"
              },
              {
                icon: <Shield className="h-6 w-6 text-red-600" />,
                title: "HIPAA Compliant",
                desc: "Enterprise-grade security with full encryption and compliance with medical data regulations.",
                bg: "bg-red-50"
              },
              {
                icon: <Database className="h-6 w-6 text-indigo-600" />,
                title: "Chat with Reports",
                desc: "Ask questions, get answers and understand your reports like never before.",
                bg: "bg-indigo-50"
              }
            ].map(({ icon, title, desc, bg }, i) => (
              <Card key={i} className="border-2 shadow-md hover:shadow-lg transition-shadow duration-300 dark:border-slate-900">
                <CardContent className="pt-6">
                  <div className={`rounded-lg ${bg} p-3 w-12 h-12 flex items-center justify-center mb-4`}>
                    {icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Claim */}
      <section className='mx-auto py-16 w-full px-2 md:px-44 bg-white dark:bg-zinc-950'>
        <MagicCard className='relative overflow-hidden rounded-2xl bg-transparent text-black dark:text-white shadow-xl'>
          <PrivacySection />
        </MagicCard>
      </section>

      {/* CTA Section
      <section className="bg-white dark:bg-zinc-950">
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-5xl font-bold tracking-tight mb-4">
                Ready to Transform Your Diagnostic Workflow?
              </h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                Join thousands of medical professionals already using Spectral AI to improve accuracy and save time.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 shadow-lg rounded-full transition-transform transform hover:scale-105"
              >
                <Link to="/upload">
                  Start Your First Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <Ripple />
        </div>
      </section> */}

      {/* Contact Section */}
      {/* <section className="py-16 px-4 md:px-96 flex items-center justify-between bg-white dark:bg-zinc-950 transition-colors gap-2">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">Get in Touch</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Have questions or need support? Our team is here to help you.
            </p>
          </div>
          <div className="flex">
            <Button
              asChild
              size="lg"
              className="bg-white text-black px-8 shadow-lg rounded-full transition-transform transform hover:scale-105 text-sm font-bold"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
        <div> */}
          {/* <ScratchToReveal
            width={250}
            height={250}
            minScratchPercentage={70}
            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
          >
            <p className="text-9xl">💉</p>
          </ScratchToReveal> */}
        {/* </div>
      </section> */}

      {/* Feedback Section */}
      <>
        <div className="bg-white dark:bg-zinc-950 transition-colors">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-2">What Our Users Say</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Hear from our satisfied users about how Spectral AI has transformed their diagnostic processes.
              </p>
            </div>
          </div>
        </div>
        <div><Testimonials /></div>
        <div className="flex items-center justify-center bg-white dark:bg-zinc-950 py-5">
          <Feedback />
        </div>
      </>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Have questions? We have answers. Check out our FAQ section for more information.
            </p>
          </div>
          <FaqSection />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
