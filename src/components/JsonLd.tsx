import React from 'react';

/**
 * JsonLd component to inject structured data into the <head>
 * @param {object} schema - The Schema.org object
 */
export default function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
