import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Target, Users, Award, CheckCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About = () => {
  const partners = [
    { name: 'UNESCO', type: 'Education', logo: '🏛️' },
    { name: 'Digital Rights Foundation', type: 'Rights', logo: '🛡️' },
    { name: 'Youth Coalition', type: 'Youth', logo: '👥' },
    { name: 'Tech for Good', type: 'Technology', logo: '💻' },
  ];

  const steps = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Content Analysis',
      description: 'Our AI scans text using advanced NLP and pattern recognition'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Credibility Scoring',
      description: 'Multiple algorithms assess authenticity and reliability'
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'Educational Insights',
      description: 'Get detailed explanations and media literacy tips'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community Verification',
      description: 'Crowdsourced validation from our expert community'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glass" />
          <div className="container relative z-10 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                About Truth-Lens
              </h1>
              <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
                Empowering digital citizens with AI-powered media literacy tools to combat misinformation and build critical thinking skills.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="glass-card p-8 hover-lift">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-primary">
                      <Target className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize access to credible information and empower young people with the critical thinking skills needed to navigate today's complex digital landscape.
                  </p>
                </div>

                <div className="glass-card p-8 hover-lift">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-primary">
                      <Award className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    A world where every individual can confidently identify, evaluate, and share information responsibly, creating a more informed and connected global community.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl animate-pulse-glow" />
                <img 
                  src="/cyber-female.png" 
                  alt="Mission visualization" 
                  className="w-full rounded-2xl shadow-glow relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-background-alt">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                How Truth-Lens Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our four-step process combines cutting-edge AI with human expertise
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="glass-card hover-lift text-center group">
                  <CardHeader>
                    <div className="mx-auto p-4 rounded-full bg-gradient-primary group-hover:animate-pulse-glow transition-all duration-300">
                      {React.cloneElement(step.icon, { className: "h-8 w-8 text-primary-foreground" })}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Our Partners
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Working together to build a more informed digital world
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <Card key={index} className="glass-card hover-lift text-center group cursor-pointer">
                  <CardContent className="pt-8">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {partner.logo}
                    </div>
                    <h3 className="font-semibold mb-2">{partner.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {partner.type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glass" />
          <div className="container relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join the Movement
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Be part of the solution. Help us build a more informed digital future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-accent font-semibold rounded-lg hover-lift hover:shadow-glow transition-all duration-300 border border-gray-300">
                <Zap className="inline-block mr-2 h-5 w-5" />
                Get Started
              </button>
              <button className="px-8 py-4 border border-white/20 bg-white/10 text-white font-semibold rounded-lg hover-lift hover:bg-white/20 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;