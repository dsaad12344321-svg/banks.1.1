'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  visible?: boolean;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [visibleAnswers, setVisibleAnswers] = useState<Set<number>>(new Set());

  const toggleAnswer = (index: number) => {
    const newVisible = new Set(visibleAnswers);
    if (newVisible.has(index)) {
      newVisible.delete(index);
    } else {
      newVisible.add(index);
    }
    setVisibleAnswers(newVisible);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          أسئلة شائعة حول شهادات الادخار
        </CardTitle>
        <CardDescription>
          إجابات على أكثر الأسئلة شيوعاً حول الاستثمار في شهادات البنوك المصرية
          <br />
          <span className="text-sm text-muted-foreground">
            اضغط على السؤال لإظهار الإجابة
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isVisible = visibleAnswers.has(index);
            
            return (
              <div 
                key={index} 
                className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleAnswer(index)}
                  className="w-full text-right p-4 bg-secondary/50 hover:bg-secondary/80 transition-colors duration-200 flex items-center justify-between group"
                  aria-expanded={isVisible}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium text-foreground text-right">
                    {faq.question}
                  </span>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-sm">
                      {isVisible ? 'إخفاء' : 'إظهار'}
                    </span>
                    {isVisible ? (
                      <ChevronUp className="w-4 h-4 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </div>
                </button>
                
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-4 bg-background border-t border-border">
                    <p className="text-muted-foreground leading-relaxed text-right">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
       
 
      </CardContent>
    </Card>
  );
}
