'use strict';

{
    const titleClickHandler = function(event){
        event.preventDefault();
        const clickedElement = this;

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
    };

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles',
        optArticleTagsSelector = '.post-tags .list',
        optArticleAuthorSelector = '.post-author',
        optTagsListSelector = '.tags.list',
        optCloudClassCount = 5,
        optCloudClassPrefix = 'tag-size-',
        optAuthorsListSelector = '.authors.list';

    const generateTitleLinks = function(customSelector = ''){

        /* [DONE] remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';

        /* [DONE] for each article */
        const articles = document.querySelectorAll(optArticleSelector + customSelector);

        /* [DONE] find all the articles and save them to variable: articles */
        let html = '';

        for(let article of articles){

            /* [DONE] get the article id */
            const articleId = article.getAttribute('id');

            /* [DONE] find the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* [DONE] create HTML of the link */
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

            /* [DONE] insert link into html variable */
            html = html + linkHTML;
        }

        /* [DONE] insert link into titleList */
        titleList.innerHTML = html;

        const links = document.querySelectorAll('.titles a');

        for(let link of links){
            link.addEventListener('click', titleClickHandler);
        }
    };

    generateTitleLinks();

    const calculateTagsParams = function(tags){
        const params = {'max': 0, 'min': 999999};

        for(let tag in tags){
            if(tags[tag] > params.max){
                params.max = tags[tag];
            } 
            if(tags[tag] < params.min){
                params.min = tags[tag];
            }
        }
        return params;
    };

    const calculateTagClass = function(count, params){
        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min;
        const percentage = normalizedCount / normalizedMax;
        const classNumber = Math.floor(percentage * (optCloudClassCount -1) +1 );

        return optCloudClassPrefix + classNumber;
    };

    const generateTags = function(){

        /* [NEW] create a new variable allTags with an empty object */
        let allTags = {};

        /* [DONE] find all articles */
        const articles = document.querySelectorAll(optArticleSelector);
        
        /* [DONE] START LOOP: for every article: */
        for(let article of articles){

            /* [DONE] find tags wrapper */
            const tagsWrapper = article.querySelector(optArticleTagsSelector);
            
            /* [DONE] make html variable with empty string */
            let html = '';

            /* [DONE] get tags from data-tags attribute */
            const articleTags = article.getAttribute('data-tags');

            /* [DONE] split tags into array */
            const articleTagsArray = articleTags.split(' ');
            
            /* [DONE] START LOOP: for each tag */
            for(let tag of articleTagsArray){

                /* [DONE] generate HTML of the link */
                const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';

                /* [DONE] add generated code to html variable */
                html = html + linkHTML;

                /* [NEW] check if this link is NOT already in allTags */
                if(!allTags[tag]){
                    /* [NEW] add tag to allTags object */
                    allTags[tag] = 1;
                } else{
                    allTags[tag]++;
                }

            /* [DONE] END LOOP: for each tag */
            }
            
            /* [DONE] insert HTML of all the links into the tags wrapper */
            tagsWrapper.innerHTML = html;

        /* [DONE] END LOOP: for every article: */
        }
        
        /* [NEW] find list of tags in right column */
        const tagList = document.querySelector(optTagsListSelector);
        
        /* [NEW] add html from allTags to tagList */
        //tagList.innerHTML = allTags.join('');

        const tagsParams = calculateTagsParams(allTags);

        /* [NEW] create variable for all links HTML code */
        let allTagsHTML = '';

        /* [NEW] START LOOP: for each tag in allTags: */
        for(let tag in allTags){
            /* [NEW] generate code of a link and add it to allTagsHTML */
            const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
            allTagsHTML +=  '<li><a href="#tag-' + tag + '" class="' + tagLinkHTML + '">' + tag + '</a></li>';
        }

        /*[NEW] add HTML from allTagsHTML to tagList */
        tagList.innerHTML = allTagsHTML;
    };

    generateTags();

    const tagClickHandler = function(event){
        
        /* [DONE] prevent default action for this event */
        event.preventDefault();

        /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;

        /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');

        /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
        const tag = href.replace('#tag-' , '');
        
        /* [DONE] find all tag links with class active */
        const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
        
        /* [DONE] START LOOP: for each active tag link */
        for(let activeTagLink of activeTagLinks){

            /* [DONE] remove class active */
            activeTagLink.classList.remove('active');

        /* [DONE] END LOOP: for each active tag link */
        }

        /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
        const equalTags = document.querySelectorAll('a[href="' + href + '"]');
        
        /* [DONE] START LOOP: for each found tag link */
        for(let equalTag of equalTags){
        
            /* [DONE] add class active */
            equalTag.classList.add('active');

        /* [DONE] END LOOP: for each found tag link */
        }

        /* [DONE] execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-tags~="' + tag + '"]');
    };
        
    const addClickListenersToTags = function(){

        /* [DONE] find all links to tags */
        const allLinks = document.querySelectorAll('.post-tags a, .tags a');

        /* [DONE] START LOOP: for each link */
        for(let allLink of allLinks){

            /* [DONE] add tagClickHandler as event listener for that link */
            allLink.addEventListener('click', tagClickHandler);

        /* [DONE] END LOOP: for each link */
        }
    };
        
    addClickListenersToTags();
    
    const generateAuthors = function(){
        /* [NEW] create a new variable allAuthors with an empty array */
        let allAuthors = {};

        /* [DONE] find all articles */
        const articles = document.querySelectorAll(optArticleSelector);
        
        /* START LOOP: for every article: */
        for(let article of articles){

            /* [DONE] find author wrapper */
            const authorWrapper = article.querySelector(optArticleAuthorSelector);
            let html = '';

            /* [DONE] get author from data-author attribute */
            const articleAuthor = article.getAttribute('data-author');

            const linkHTML = '<a href="' + articleAuthor + '">by ' + articleAuthor + '</a>';
            
            html = html + linkHTML;

            if(!allAuthors[articleAuthor]){
                /* [NEW] add generated code to allTags array */
                allAuthors[articleAuthor] = 1;
            } else {
                allAuthors[articleAuthor]++;
            }
            /* [DONE] insert HTML of all the links into the author wrapper */
            authorWrapper.innerHTML = linkHTML;

        /* END LOOP: for every article: */
        }
        const authorList = document.querySelector(optAuthorsListSelector);

        const authorParams = calculateTagsParams(allAuthors);

        let allAuthorsHTML = '';

        for (let articleAuthor in allAuthors) {
            allAuthorsHTML += '<li><a href="' + articleAuthor + '">' + articleAuthor + ' (' + allAuthors[articleAuthor] + ')' + '</a></li>';
        }
        authorList.innerHTML = allAuthorsHTML;
    };

    generateAuthors();

    const authorClickHandler = function(event){
        
        /* [DONE] prevent default action for this event */
        event.preventDefault();

        /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;

        /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');

        /* [DONE] make a new constant "author" and extract tag from the "href" constant */
        const author = href.replace('by ' , '');
        
        /* [DONE] find all author links with class active */
        const activeAuthors = document.querySelectorAll('.post-author a.active');
        
        /* [DONE] START LOOP: for each active author link */
        for(let activeAuthor of activeAuthors){

            /* [DONE] remove class active */
            activeAuthor.classList.remove('active');

        /* [DONE] END LOOP: for each active tag link */
        }

        /* [DONE] find all author links with "href" attribute equal to the "href" constant */
        const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
        
        /* [DONE] START LOOP: for each found tag link */
        for(let authorLink of authorLinks){
        
            /* [DONE] add class active */
            authorLink.classList.add('active');

        /* [DONE] END LOOP: for each found tag link */
        }

        /* [DONE] execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-author="' + author + '"]');

    };
        
    const addClickListenersToAuthors = function(){

        /* [DONE] find all links to authors */
        const allLinks = document.querySelectorAll('.post-author a');

        /* [DONE] START LOOP: for each link */
        for(let allLink of allLinks){

            /* [DONE] add authorClickHandler as event listener for that link */
            allLink.addEventListener('click', authorClickHandler);

        /* [DONE] END LOOP: for each link */
        }
    };

    addClickListenersToAuthors();
}