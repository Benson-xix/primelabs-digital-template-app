import ProductReel from '@/components/ProductReel';

const LatestTemplates = () => {
  return (
    <div className='mt-8 px-4'>
       <ProductReel
      title="Brand New Templates"
      query={{ createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }, sort: "desc", limit: 4 }}
      href="/latest"
    />
    </div>
   
  );
};

export default LatestTemplates;
