import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const About = () => {
  const faqs = [
    {
      question: "What is the Student Management System?",
      answer: "The Student Management System is a comprehensive platform designed to streamline the management of student records, courses, and academic activities. It provides an efficient way for educational institutions to handle student data, track academic progress, and manage administrative tasks."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! Simply sign up for an account using your email address. Once registered, you'll have access to all the features of the system. You can then begin managing student records, courses, and generating reports."
    },
    {
      question: "What features are available?",
      answer: "Our system offers a wide range of features including student record management, course tracking, grade management, attendance monitoring, report generation, and more. The platform is designed to be user-friendly while providing powerful tools for educational administration."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. Our system uses industry-standard encryption and security measures to protect all user data. We comply with relevant data protection regulations and regularly update our security protocols to ensure the highest level of data protection."
    },
    {
      question: "How can I get support?",
      answer: "We offer multiple support channels including email support at kushwahadheeraj245@gmail.com and phone support at +91 8299301972. Our support team is available to assist you with any questions or issues you may encounter while using the system."
    },
    {
      question: "Can I customize the system for my institution?",
      answer: "Yes, the Student Management System is designed to be flexible and adaptable to different institutional needs. We offer customization options to ensure the system aligns with your specific requirements and workflows."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Student Management System
          </h1>
          <p className="text-lg text-gray-600">
            Learn more about our platform and how it can help you manage your educational institution effectively.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Need More Information?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us directly for any additional questions or to schedule a demo.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:kushwahadheeraj245@gmail.com"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Email Us
            </a>
            <a
              href="tel:+918299301972"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
