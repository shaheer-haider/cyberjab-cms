import type { Collection } from 'tinacms';

const Skill: Collection = {
    label: 'Skills',
    name: 'skill',
    path: 'content/skills',
    format: 'md',
    fields: [
        {
            type: 'string',
            label: 'Name',
            name: 'name',
            required: true,
            description: 'Skill name (e.g., Log Analysis, Incident Response)',
        },
        {
            type: 'string',
            label: 'Slug',
            name: 'slug',
            required: true,
            isTitle: true,
            description: 'URL-friendly identifier',
        },
        {
            type: 'string',
            label: 'Description',
            name: 'description',
            description: 'What does this skill involve?',
            ui: {
                component: 'textarea',
            },
        },
        {
            type: 'reference',
            label: 'Topic',
            name: 'topic',
            collections: ['topic'],
            description: 'Related topic category',
        },
    ],
};

export default Skill;
