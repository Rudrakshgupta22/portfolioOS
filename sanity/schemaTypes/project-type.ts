import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Project Title', type: 'string', validation: rule => rule.required() }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 },
      validation: rule => rule.required()
    }),
    defineField({ name: 'status', title: 'Status (e.g. DEPLOYED)', type: 'string' }),
    defineField({ name: 'directive', title: 'Directive / Overview', type: 'text', rows: 4 }),
    defineField({ name: 'githubUrl', title: 'GitHub Repository URL', type: 'url' }),
    defineField({ name: 'liveUrl', title: 'Live Deployment URL', type: 'url' }),
    defineField({
      name: 'mainImage',
      title: 'Project Cover / Screenshot',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Project Screenshots',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'techStack', title: 'Tech Stack (Array of Strings)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'impactMetrics', title: 'Impact Metrics', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'anomalyReport',
      title: 'Anomaly Report',
      type: 'object',
      fields: [
        defineField({ name: 'issue', title: 'Issue', type: 'text' }),
        defineField({ name: 'resolution', title: 'Resolution', type: 'text' }),
      ],
    }),
  ],
})