import { notFound } from 'next/navigation';
import client from '../../../tina/__generated__/client';
import Layout from '../../../components/layout/layout';
import ClientPage from './client-page';

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

export async function generateStaticParams() {
    let modules = await client.queries.moduleConnection();
    const allModules = modules;

    if (!allModules.data.moduleConnection.edges) {
        return [];
    }

    while (modules.data?.moduleConnection.pageInfo.hasNextPage) {
        modules = await client.queries.moduleConnection({
            after: modules.data.moduleConnection.pageInfo.endCursor,
        });

        if (!modules.data.moduleConnection.edges) {
            break;
        }

        allModules.data.moduleConnection.edges.push(...modules.data.moduleConnection.edges);
    }

    return (
        allModules.data?.moduleConnection.edges.map((edge) => ({
            urlSegments: edge?.node?._sys.breadcrumbs,
        })) || []
    );
}
