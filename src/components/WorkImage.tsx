import assets from '@/data/image-assets.json';

type Asset = { width: number; height: number; src: string; variants: { src: string; width: number }[] };
export function imageAsset(source: string): Asset {
    const asset = (assets as Record<string, Asset>)[source];
    if (!asset) throw new Error(`Missing image asset: ${source}. Run npm run images.`);
    return asset;
}

export default function WorkImage({ source, alt, sizes = '100vw', priority = false, className = '' }: {
    source: string; alt: string; sizes?: string; priority?: boolean; className?: string;
}) {
    const asset = imageAsset(source);
    return (
        // Static export: pre-generated WebP variants, no image server required.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset.src} srcSet={asset.variants.map(v => `${v.src} ${v.width}w`).join(', ')}
            sizes={sizes} width={asset.width} height={asset.height} alt={alt}
            loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
            decoding="async" className={className} />
    );
}
