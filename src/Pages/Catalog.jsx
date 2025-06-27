import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../Components/core/Catalog/CourseSlider';
import CatalogCard from '../Components/core/Catalog/CatalogCard';

const Catalog = () => {
  const { catalog } = useParams();
  const [desc, setDesc] = useState([]);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [activeOption, setActiveOption] = useState(1);
  const dispatch = useDispatch();

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      const categoryList = result.data.categories;
      const matchedCategory = categoryList.find(
        (item) => item.name.toLowerCase() === catalog.toLowerCase()
      );

      if (!matchedCategory) {
        console.error("No matching category found for:", catalog);
        return;
      }

      setCategoryID(matchedCategory._id);
      setDesc(matchedCategory);
    } catch (error) {
      console.error("Could not fetch sublinks:", error);
    }
  };

  useEffect(() => {
    fetchSublinks();
  }, [catalog]);

  useEffect(() => {
    let isMounted = true;

    const fetchCatalogPageData = async () => {
      const result = await getCatalogPageData(categoryID, dispatch);
      if (isMounted) setCatalogPageData(result);
    };

    if (categoryID) fetchCatalogPageData();

    return () => {
      isMounted = false;
    };
  }, [categoryID]);

  if (!catalog) return <div className='text-center text-white'>Invalid category</div>;

  return (
    <div>
      <div className='box-content bg-richblack-800 px-4'>
        <div className='mx-auto flex min-h-[260px] flex-col justify-center gap-4'>
          <p className='text-sm text-richblack-300'>
            Home / Catalog / <span className='text-yellow-25'>{catalog}</span>
          </p>
          <p className='text-3xl text-richblack-5'>{catalog}</p>
          <p className='max-w-[870px] text-richblack-200'>{desc?.description}</p>
        </div>
      </div>

      <div className='mx-auto w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
        <h2 className='text-2xl font-semibold text-white'>Courses to get you started</h2>
        <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
          <button
            onClick={() => setActiveOption(1)}
            className={`px-4 py-2 ${activeOption === 1
              ? 'border-b border-b-yellow-25 text-yellow-25'
              : 'text-richblack-50'
              }`}
          >
            Most Popular
          </button>
          <button
            onClick={() => setActiveOption(2)}
            className={`px-4 py-2 ${activeOption === 2
              ? 'border-b border-b-yellow-25 text-yellow-25'
              : 'text-richblack-50'
              }`}
          >
            New
          </button>
        </div>

        {catalogPageData?.selectedCourses?.length > 0 ? (
          <CourseSlider
            Courses={
              activeOption === 1
                ? catalogPageData.selectedCourses
                : [...catalogPageData.selectedCourses].reverse()
            }
          />
        ) : (
          <p className='text-richblack-300'>No courses found in this category.</p>
        )}
      </div>

      <div className='mx-auto w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
        <h2 className='section_heading mb-6 text-xl md:text-3xl'>
          Similar to {catalog}
        </h2>
        <CourseSlider Courses={catalogPageData?.differentCourses || []} />
      </div>

      <div className='mx-auto w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
        <h2 className='section_heading mb-6 text-xl md:text-3xl'>Frequently Bought Together</h2>
        <div className='grid grid-cols-2 gap-3 pr-4 lg:grid-cols-2 lg:gap-6'>
          {catalogPageData?.mostSellingCourses?.map((item, index) => (
            <CatalogCard key={index} course={item} Height={"h-[100px] lg:h-[400px]"} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
