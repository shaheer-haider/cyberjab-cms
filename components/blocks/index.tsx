import React from 'react';
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
                        case 'PageBlocksStats':
                            return <Stats key={i} data={block} />;
                        case 'PageBlocksCta':
                            return <CallToAction key={i} data={block} />;
                        case 'PageBlocksContent':
                            return <Content key={i} data={block} />;
                        case 'PageBlocksVideo':
                            return <Video key={i} data={block} />;
                        default:
                            return null;
                    }
                })}
        </>
    );
};
