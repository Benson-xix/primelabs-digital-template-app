import ProductReel from '@/components/ProductReel';

const EditorsPick = () => {
  return (
   <div className='mt-8 px-4'>
     <ProductReel
      title="Editor's Pick"
      query={{ approvedForSale: true, sort: "desc", limit: 4 }}
      href="/editors-pick"
    />
   </div>
  );
};

export default EditorsPick;
