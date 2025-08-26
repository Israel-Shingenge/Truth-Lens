import React from 'react';
import { BookOpen, Eye, Users, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MediaLiteracyGuide: React.FC = () => {
  const redFlags = [
    {
      title: 'Emotional Language',
      description: 'Excessive use of emotional words designed to trigger strong reactions',
      examples: ['Shocking!', 'You won\'t believe...', 'Terrifying truth...'],
      severity: 'high'
    },
    {
      title: 'Missing Sources',
      description: 'Claims made without proper citations or verifiable sources',
      examples: ['Studies show...', 'Experts say...', 'It is known that...'],
      severity: 'high'
    },
    {
      title: 'Confirmation Bias',
      description: 'Content that only presents one side of a complex issue',
      examples: ['All [group] are...', 'Never trust...', 'Always avoid...'],
      severity: 'medium'
    },
    {
      title: 'Outdated Information',
      description: 'Old information presented as current news or facts',
      examples: ['Recent studies from 2010...', 'New research shows... (from 2015)'],
      severity: 'medium'
    }
  ];

  const verificationSteps = [
    {
      step: 1,
      title: 'Check the Source',
      description: 'Verify the credibility and reputation of the publisher',
      actions: ['Look up the publication', 'Check their about page', 'Review their track record']
    },
    {
      step: 2,
      title: 'Cross-Reference',
      description: 'Look for the same information from multiple reliable sources',
      actions: ['Search for other coverage', 'Check mainstream sources', 'Look for original research']
    },
    {
      step: 3,
      title: 'Check the Date',
      description: 'Ensure the information is current and relevant',
      actions: ['Verify publication date', 'Check for updates', 'Consider context timing']
    },
    {
      step: 4,
      title: 'Analyze the Evidence',
      description: 'Examine the quality and relevance of supporting evidence',
      actions: ['Review cited sources', 'Check methodology', 'Look for peer review']
    }
  ];

  const biasTypes = [
    {
      name: 'Confirmation Bias',
      description: 'Favoring information that confirms existing beliefs',
      color: 'destructive'
    },
    {
      name: 'Selection Bias',
      description: 'Cherry-picking data that supports a particular viewpoint',
      color: 'warning'
    },
    {
      name: 'Framing Bias',
      description: 'Presenting information in a way that influences perception',
      color: 'accent'
    },
    {
      name: 'Attribution Bias',
      description: 'Making assumptions about causes without sufficient evidence',
      color: 'primary'
    }
  ];

  return (
    <section id="media-literacy" className="py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="mr-2 h-4 w-4" />
              Educational Resources
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Media Literacy Guide</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Learn to identify misinformation, understand bias, and develop critical thinking 
              skills for navigating today's information landscape.
            </p>
          </div>

          <Tabs defaultValue="red-flags" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="red-flags">Red Flags</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="bias">Bias Types</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="red-flags" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Warning Signs to Watch For
                  </h3>
                  <div className="space-y-4">
                    {redFlags.map((flag, index) => (
                      <Card key={index} className="border-card-border">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{flag.title}</CardTitle>
                            <Badge 
                              variant={flag.severity === 'high' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {flag.severity} risk
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-3">
                            {flag.description}
                          </CardDescription>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Common phrases:</p>
                            {flag.examples.map((example, idx) => (
                              <div key={idx} className="text-xs bg-muted px-2 py-1 rounded italic">
                                "{example}"
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Card className="glass border-card-border h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Quick Assessment Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'Does the headline match the content?',
                        'Are sources clearly cited and credible?',
                        'Is the language emotionally neutral?',
                        'Does it present multiple perspectives?',
                        'Is the information recent and relevant?',
                        'Can you verify claims independently?'
                      ].map((question, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded border border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-primary">{index + 1}</span>
                          </div>
                          <span className="text-sm">{question}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="verification" className="mt-8">
              <div className="grid gap-6 lg:grid-cols-2">
                {verificationSteps.map((step, index) => (
                  <Card key={index} className="border-card-border hover-lift">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-foreground">{step.step}</span>
                        </div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </div>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {step.actions.map((action, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                            {action}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bias" className="mt-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {biasTypes.map((bias, index) => (
                  <Card key={index} className="border-card-border text-center">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-full bg-${bias.color}/10 mx-auto flex items-center justify-center mb-3`}>
                        <Info className={`h-6 w-6 text-${bias.color}`} />
                      </div>
                      <CardTitle className="text-base">{bias.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {bias.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8 glass border-card-border">
                <CardHeader>
                  <CardTitle>Recognizing Bias in Content</CardTitle>
                  <CardDescription>
                    Understanding how bias manifests in information can help you evaluate content more critically.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-3 text-destructive">Biased Language Indicators</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Loaded or emotional words</li>
                        <li>• Absolute statements (always/never)</li>
                        <li>• Stereotyping language</li>
                        <li>• One-sided perspectives</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-success">Balanced Content Signs</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Multiple viewpoints presented</li>
                        <li>• Neutral, factual language</li>
                        <li>• Qualified statements</li>
                        <li>• Clear source attribution</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-card-border">
                  <CardHeader>
                    <CardTitle className="text-base">Fact-Checking Sites</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>• Snopes.com</div>
                    <div>• FactCheck.org</div>
                    <div>• PolitiFact.com</div>
                    <div>• AP Fact Check</div>
                    <div>• BBC Reality Check</div>
                  </CardContent>
                </Card>

                <Card className="border-card-border">
                  <CardHeader>
                    <CardTitle className="text-base">Reverse Image Search</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>• Google Images</div>
                    <div>• TinEye</div>
                    <div>• Yandex Images</div>
                    <div>• Bing Visual Search</div>
                  </CardContent>
                </Card>

                <Card className="border-card-border">
                  <CardHeader>
                    <CardTitle className="text-base">Source Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>• AllSides Media Bias Chart</div>
                    <div>• Media Bias/Fact Check</div>
                    <div>• Wikipedia Source Lists</div>
                    <div>• University Libraries</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default MediaLiteracyGuide;