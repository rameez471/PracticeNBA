import React from 'react';
import NewsSlider from '../../../widgets/NewsSlider/slider';
import NewsList from '../../../widgets/NewsList/newsList';

const NewsMain=()=>{
    return(
        <div>
            <NewsSlider
                type='featured'
                setting={{dots:false}}
                start={0}
                amount={3}
            />
            <NewsList
                type='cardMain'
                loadMore={true}
                start={3}
                amount={6}
            />
        </div>
    )
}

export default NewsMain;