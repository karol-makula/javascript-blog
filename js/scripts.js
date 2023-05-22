'use strict';


const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked');

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
        
    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post.active');
    
    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags.list';

function generateTitleLinks(){

    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* [DONE] for each article */
    const articles = document.querySelectorAll(optArticleSelector);

    /* [DONE] find all the articles and save them to variable: articles */
    let html = '';

    for(let article of articles){

        /* [DONE] get the article id */
        const articleId = article.getAttribute('id');
        console.log(articleId);

        /* [DONE] find the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;

        /* [DONE] create HTML of the link */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        console.log(linkHTML);

        /* [DONE] insert link into html variable */
        html = html + linkHTML;
    }

    /* [DONE] insert link into titleList */
    titleList.innerHTML = html;
    console.log(html);

    const links = document.querySelectorAll('.titles a');
    console.log('Links: ', links);

    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }
}

generateTitleLinks();

function generateTags(){

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles){
  
        /* find tags wrapper */
        const tagsWrapper = article.querySelector(optArticleTagsSelector);

        /* make html variable with empty string */
        let html = '';

        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');

        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        
        /* START LOOP: for each tag */
        for(let tag of articleTagsArray){

            /* generate HTML of the link */
            const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

            /* add generated code to html variable */
            html = html + linkHTML;

        /* END LOOP: for each tag */
        }
        
        /* insert HTML of all the links into the tags wrapper */
        tagsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
    }
}

generateTags();