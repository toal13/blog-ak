"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="name">* Name</Label>
          <Input id="name" placeholder="Your name" required />
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Optional title" />
        </div>

        <div>
          <Label htmlFor="tel">Tel</Label>
          <Input id="tel" placeholder="Your phone number" />
        </div>

        <div>
          <Label htmlFor="email">* Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="message">* Message</Label>
          <Textarea
            id="message"
            placeholder="Write your message here..."
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Send
        </Button>
      </form>
    </div>
  );
}
