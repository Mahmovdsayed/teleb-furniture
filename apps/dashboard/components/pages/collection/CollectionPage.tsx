'use client';

import SectionInfo from "@/components/layout/dashboard/SectionInfo";
import CollectionSkeleton from "@teleb/ui/components/collection-skeleton";
import CollectionCard from "@/components/ui/CollectionCard";
import EmptyState from "@teleb/ui/components/empty-state";
import { useAppQuery } from "@teleb/ui/hooks/use-app-query";
import { getCollections } from "@/services/collection";
import { Collection } from "@teleb/types/collection";
import { useTranslations } from "next-intl";

const CollectionPage = () => {
    const t = useTranslations("dashboard.resources")
    const { data, isLoading, refetch } = useAppQuery<Collection[]>({ queryFn: getCollections, queryKey: ['collections'] })
    if (isLoading) return <CollectionSkeleton />

    return <>
        <section>
            <SectionInfo
                title={t("collections.title")}
                desc={t("collections.listDescription")}
                href={"/collection/add"}
                buttonTitle={t("createTitle", {
                    resource: t("collections.singular"),
                })}
            />
            {data?.length ? (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {data.map((collection: Collection) => (
                        <CollectionCard
                            refetch={refetch}
                            collection={collection}
                            key={collection.id}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={t("collections.emptyTitle")}
                    description={t("collections.emptyDescription")}
                />
            )}
        </section>
    </>;
};

export default CollectionPage;