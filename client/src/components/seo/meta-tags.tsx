import { useEffect } from "react";

interface MetaTagsProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "product" | "article";
    price?: number;
    currency?: string;
}

/**
 * Updates document meta tags for SEO
 * Usage: <MetaTags title="Product Name" description="..." />
 */
export function MetaTags({
    title,
    description = "فيش ويب - أفضل متجر لمستلزمات أحواض الأسماك في العراق",
    image = "https://fishweb.iq/og-image.jpg",
    url,
    type = "website",
    price,
    currency = "IQD",
}: MetaTagsProps) {
    useEffect(() => {
        // Update title
        document.title = `${title} | فيش ويب`;

        // Helper to set meta tag
        const setMetaTag = (name: string, content: string, property = false) => {
            const attr = property ? "property" : "name";
            let meta = document.querySelector(`meta[${attr}="${name}"]`);
            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute(attr, name);
                document.head.appendChild(meta);
            }
            meta.setAttribute("content", content);
        };

        // Basic meta tags
        setMetaTag("description", description);
        setMetaTag("robots", "index, follow");

        // Open Graph
        setMetaTag("og:title", title, true);
        setMetaTag("og:description", description, true);
        setMetaTag("og:image", image, true);
        setMetaTag("og:type", type, true);
        if (url) setMetaTag("og:url", url, true);
        setMetaTag("og:site_name", "فيش ويب", true);
        setMetaTag("og:locale", "ar_IQ", true);

        // Twitter Card
        setMetaTag("twitter:card", "summary_large_image");
        setMetaTag("twitter:title", title);
        setMetaTag("twitter:description", description);
        setMetaTag("twitter:image", image);

        // Product specific (for e-commerce)
        if (type === "product" && price) {
            setMetaTag("product:price:amount", price.toString(), true);
            setMetaTag("product:price:currency", currency, true);
        }

        // Cleanup not needed as we want tags to persist
    }, [title, description, image, url, type, price, currency]);

    return null;
}

/**
 * Schema.org structured data for products
 */
export function ProductSchema({
    name,
    description,
    image,
    price,
    currency = "IQD",
    brand,
    sku,
    rating,
    reviewCount,
    inStock = true,
}: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    brand?: string;
    sku?: string;
    rating?: number;
    reviewCount?: number;
    inStock?: boolean;
}) {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name,
        description,
        image,
        brand: brand ? { "@type": "Brand", name: brand } : undefined,
        sku,
        offers: {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            availability: inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: typeof window !== "undefined" ? window.location.href : "",
        },
        aggregateRating:
            rating && reviewCount
                ? {
                    "@type": "AggregateRating",
                    ratingValue: rating,
                    reviewCount: reviewCount,
                }
                : undefined,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Schema.org structured data for organization
 */
export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "فيش ويب",
        url: "https://fishweb.iq",
        logo: "https://fishweb.iq/logo.png",
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+964-770-000-0000",
            contactType: "customer service",
            availableLanguage: ["Arabic", "English"],
        },
        sameAs: [
            "https://facebook.com/fishwebiq",
            "https://instagram.com/fishwebiq",
        ],
        address: {
            "@type": "PostalAddress",
            addressLocality: "Baghdad",
            addressCountry: "IQ",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Schema.org structured data for breadcrumbs
 */
export function BreadcrumbSchema({
    items,
}: {
    items: { name: string; url: string }[];
}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
