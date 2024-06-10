import ProductReel from '@/components/ProductReel';

const BestSelling = () => {
  return (
   <div className='mt-8 px-4'>
    <ProductReel
  title="Best Selling"
  query={{ sort: "bestselling", limit: 4 }} 
  href="/best-selling"
/>
   </div>
  );
};

export default BestSelling;
