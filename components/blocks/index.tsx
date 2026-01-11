import React from 'react';
import { PageBlocksCallout, PageBlocksContent, PageBlocksCta, PageBlocksHero, PageBlocksStats, PageBlocksVideo } from '@/tina/__generated__/types';
import { Hero } from './hero';
import { Callout } from './callout';
import { Stats } from './stats';
import { CallToAction } from './call-to-action';
import { Content } from './content';
import { Video } from './video';

export const Blocks = (props: any) => {
    return (
        <>
            {props.blocks &&
                props.blocks.map((block: any, i: number) => {
                    switch (block.__typename) {
                        case 'PageBlocksHero':
                            return <Hero key={i} data={block as PageBlocksHero} />;
                        case 'PageBlocksCallout':
                            return <Callout key={i} data={block as PageBlocksCallout} />;
                        case 'PageBlocksStats':
                            return <Stats key={i} data={block as PageBlocksStats} />;
                        case 'PageBlocksCta':
                            return <CallToAction key={i} data={block as PageBlocksCta} />;
                        case 'PageBlocksContent':
                            return <Content key={i} data={block as PageBlocksContent} />;
                        case 'PageBlocksVideo':
                            return <Video key={i} data={block as PageBlocksVideo} />;
                        default:
                            return null;
                    }
                })}
        </>
    );
};
