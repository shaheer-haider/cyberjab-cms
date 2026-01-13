import { notFound } from 'next/navigation';
import client from '../../../tina/__generated__/client';
import Layout from '../../../components/layout/layout';
import ClientPage from './client-page';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function ModulePage({
    params,
}: {
    params: Promise<{ urlSegments: string[] }>;
}) {
    const resolvedParams = await params;
    const filepath = resolvedParams.urlSegments.join('/');

    let data;
    try {
        data = await client.queries.module({
            relativePath: `${filepath}.mdx`,
        });
    } catch (error) {
        notFound();
    }

    return (
        <Layout rawPageData={data}>
            <ClientPage {...data} />
        </Layout>
    );
}

// Static generation disabled - pages are generated on-demand
// export async function generateStaticParams() {
//     return [];
// }
