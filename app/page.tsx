"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function HomePage() {
  const t = useTranslation();
  const h = t.home; // All homepage strings under "home"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">💙</span>
            <h1 className="text-2xl font-serif font-bold text-foreground">{h.app_name}</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              {h.why_diacare}
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              {h.how_it_works}
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
              {h.our_story}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md hover:-translate-y-0.5">
                {h.sign_in}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md hover:-translate-y-0.5">
                {h.get_started}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 transition-all duration-300 hover:scale-105">
            {h.hero_badge}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-balance mb-6 leading-tight transition-all duration-300 hover:scale-105">
            {h.hero_title_prefix}
            <span className="text-primary">{h.hero_title_highlight}</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed max-w-2xl mx-auto transition-all duration-300 hover:scale-102">
            {h.hero_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-0.5">
                {h.hero_cta_start}
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-0.5">
                {h.hero_cta_features}
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6 transition-all duration-300 hover:scale-102">
            {h.hero_cta_subtext}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 transition-all duration-300 hover:scale-105">
              {h.features_title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance transition-all duration-300 hover:scale-102">
              {h.features_description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">👨‍🍳</span>
                <CardTitle className="text-xl">{h.features_cards[0].title}</CardTitle>
                <CardDescription>{h.features_cards[0].description}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">📅</span>
                <CardTitle className="text-xl">{h.features_cards[1].title}</CardTitle>
                <CardDescription>{h.features_cards[1].description}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">🛡️</span>
                <CardTitle className="text-xl">{h.features_cards[2].title}</CardTitle>
                <CardDescription>{h.features_cards[2].description}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">👥</span>
                <CardTitle className="text-xl">{h.features_cards[3].title}</CardTitle>
                <CardDescription>{h.features_cards[3].description}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">⚡</span>
                <CardTitle className="text-xl">{h.features_cards[4].title}</CardTitle>
                <CardDescription>{h.features_cards[4].description}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow duration-300 hover:scale-105">
              <CardHeader>
                <span className="text-4xl mb-4">💙</span>
                <CardTitle className="text-xl">{h.features_cards[5].title}</CardTitle>
                <CardDescription>{h.features_cards[5].description}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4 transition-all duration-300 hover:scale-105">
              {h.how_it_works_title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance transition-all duration-300 hover:scale-102">
              {h.how_it_works_description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {h.steps.map((step, idx) => (
              <div key={idx} className="text-center transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-serif font-bold mb-6 text-balance transition-all duration-300 hover:scale-105">
            {h.cta_title}
          </h2>
          <p className="text-xl mb-8 opacity-90 text-balance leading-relaxed transition-all duration-300 hover:scale-102">
            {h.cta_description}
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-0.5">
              {h.cta_button}
            </Button>
          </Link>
          <p className="text-sm mt-6 opacity-75 transition-all duration-300 hover:scale-102">
            {h.cta_subtext}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-gradient-to-t from-muted/30 to-background">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0 transition-all duration-300 hover:scale-105">
            <span className="text-2xl animate-pulse">💙</span>
            <span className="text-lg font-serif font-semibold tracking-wide">{h.app_name}</span>
          </div>

          <a href="mailto:diacare-support@gmail.com" target="_blank" rel="noopener noreferrer">
            <button
              className="relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold 
              text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg 
              transition-all duration-300 hover:shadow-blue-300/50 hover:-translate-y-1 hover:scale-105 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ✉️ {h.contact_us}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 transition-opacity duration-300 hover:opacity-30"></span>
            </button>
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground transition-all duration-300 hover:scale-102">
          <p> © 2026 {h.app_name}. {h.rights_reserved}</p>
        </div>
      </footer>
    </div>
  );
}