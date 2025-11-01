
import React from 'react';
import { Scene } from '../types';
import Loader from './Loader';

interface StorySceneProps {
  scene: Scene;
  isGeneratingAll: boolean;
}

const ImagePlaceholder: React.FC = () => (
    <div className="w-full h-full bg-amber-100 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>
);


const StoryScene: React.FC<StorySceneProps> = ({ scene, isGeneratingAll }) => {
  const [isLoadingThisScene, setIsLoadingThisScene] = React.useState(false);

  React.useEffect(() => {
    if (isGeneratingAll && !scene.imageUrl) {
        setIsLoadingThisScene(true);
    }
    if(scene.imageUrl) {
        setIsLoadingThisScene(false);
    }
  }, [isGeneratingAll, scene.imageUrl]);


  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-amber-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px] lg:min-h-[400px]">
        <div className="relative aspect-video lg:aspect-auto bg-amber-50 flex items-center justify-center p-4">
          {scene.imageUrl ? (
            <img src={scene.imageUrl} alt={`Illustration for scene ${scene.id}`} className="w-full h-full object-cover rounded-lg" />
          ) : isLoadingThisScene ? (
            <div className="flex flex-col items-center gap-2">
                <Loader size="h-12 w-12" />
                <p className="text-amber-600">Creating image...</p>
            </div>
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="p-6 md:p-8 flex items-center">
          <p className="text-xl md:text-2xl leading-relaxed text-stone-700">
            {scene.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryScene;
