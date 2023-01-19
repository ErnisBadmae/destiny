import { ArticleList, ArticleView, ArticleViewSelector } from "entities/Article";
import { fetchNextArticlesPage } from "../../model/services/fetchNextArticlesPage/fetchNextArticlesPage";
import { initArticlesPage } from "../../model/services/initArticlesPage/initArticlesPage";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { classNames } from "shared/lib/className/className";
import {
    DynamicModuleLoader,
    ReducerList
} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { useAppDispatch } from "shared/lib/hooks/useAppDispatch/useAppDispatch";
import { useInitialEffect } from "shared/lib/hooks/useAppDispatch/useInitialEffect";
import { Page } from "widgets/Page/Page";
import {
    getArticlesPageIsError,
    getArticlesPageIsLoading, getArticlesPageView
} from "../../model/selectors/articlesPageSelectors";
import { articlePageActions, articlePageReducer, getArticles } from "../../model/slice/articlePageSlice";
import cls from "./ArticlesPage.module.scss";

interface ArticlesPageProps {
  className?: string;
}

const reducers: ReducerList = {
    articlesPage: articlePageReducer
}

const ArticlesPage = (props: ArticlesPageProps) => {
    const { 
        className 
    } = props

    const {t} = useTranslation()
    const dispatch = useAppDispatch()

    const articles = useSelector(getArticles.selectAll)
    const isLoading = useSelector(getArticlesPageIsLoading);
    const isError = useSelector(getArticlesPageIsError)
    const view = useSelector(getArticlesPageView)

    const onChangeView = useCallback((view:ArticleView) => {
        dispatch(articlePageActions.setView(view))
    },[dispatch])

    const onLoadNextPart = useCallback(()=> {
        dispatch(fetchNextArticlesPage())
    },[dispatch])

    useInitialEffect(() => {
        dispatch(initArticlesPage())
    })

    if(isError) {
        {t('Произошла непредвиденная ошибка')}
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <Page 
                onScrollEnd={onLoadNextPart}
                className={classNames(cls.ArticlesPage, {}, [className])}
            >
                <ArticleViewSelector 
                    view={view} 
                    onViewClick={onChangeView}
                />
                <ArticleList 
                    isLoading={isLoading}
                    view={view}
                    articles={articles} 
                />
            </Page>
        </DynamicModuleLoader>
    );
};
export default memo(ArticlesPage);


