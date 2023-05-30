'use strict';

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

{
    const opts = {
        tagSizes: {
            count: 5,
            classPrefix: 'tag-size-',
        },
    };

    const select = {
        all: {
            articles: '.post',
            titles: '.post-title',
            linksTo: {
                tags: '.post-tags a, .tags a',
                authors: '.post-author a, .authors a',
            },
        },
        article: {
            tags: '.post-tags .list',
            author: '.post-author',
        },
        listOf: {
            titles: '.titles',
            tags: '.tags.list',
            authors: '.authors.list',
        },
    };
    
    const titleClickHandler = function(event){
        event.preventDefault();
        const clickedElement = this;

        /* [DONE] remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll(select.listOf.titles, 'a.active');
            
        for(let activeLink of activeLinks){
            activeLink.classList.remove('active');
        }

        /* [DONE] add class 'active' to the clicked link */
        clickedElement.classList.add('active');

        /* [DONE] remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll(select.all.articles, '.active');
        
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

    const generateTitleLinks = function(customSelector = ''){

        /* [DONE] remove contents of titleList */
        const titleList = document.querySelector(select.listOf.titles);
        titleList.innerHTML = '';

        /* [DONE] for each article */
        const articles = document.querySelectorAll(select.all.articles + customSelector);

        /* [DONE] find all the articles and save them to variable: articles */
        let html = '';

        for(let article of articles){

            /* [DONE] get the article id */
            const articleId = article.getAttribute('id');

            /* [DONE] find the title element */
            const articleTitle = article.querySelector(select.all.titles).innerHTML;

            /* [DONE] create HTML of the link */
            //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            const linkHTMLData = {id: articleId, title: articleTitle};
            const linkHTML = templates.articleLink(linkHTMLData);

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
        const classNumber = Math.floor(percentage * (opts.tagSizes.count -1) +1 );

        return opts.tagSizes.classPrefix + classNumber;
    };

    const generateTags = function(){

        /* [NEW] create a new variable allTags with an empty object */
        let allTags = {};

        /* [DONE] find all articles */
        const articles = document.querySelectorAll(select.all.articles);
        
        /* [DONE] START LOOP: for every article: */
        for(let article of articles){

            /* [DONE] find tags wrapper */
            const tagsWrapper = article.querySelector(select.article.tags);
            
            /* [DONE] make html variable with empty string */
            let html = '';

            /* [DONE] get tags from data-tags attribute */
            const articleTags = article.getAttribute('data-tags');

            /* [DONE] split tags into array */
            const articleTagsArray = articleTags.split(' ');
            
            /* [DONE] START LOOP: for each tag */
            for(let tag of articleTagsArray){

                /* [DONE] generate HTML of the link */
                //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
                const linkHTMLData = {id: tag, title: tag};
                const linkHTML = templates.tagLink(linkHTMLData);

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
        const tagList = document.querySelector(select.listOf.tags);
        
        /* [NEW] add html from allTags to tagList */
        //tagList.innerHTML = allTags.join('');

        const tagsParams = calculateTagsParams(allTags);

        /* [NEW] create variable for all links HTML code */
        //let allTagsHTML = '';
        let allTagsData = {tags: []};

        /* [NEW] START LOOP: for each tag in allTags: */
        for(let tag in allTags){
            /* [NEW] generate code of a link and add it to allTagsHTML */
            // const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
            //allTagsHTML +=  '<li><a href="#tag-' + tag + '" class="' + tagLinkHTML + '">' + tag + '</a></li>';
            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                className: calculateTagClass(allTags[tag], tagsParams)
            });
        }

        /*[NEW] add HTML from allTagsHTML to tagList */
        //tagList.innerHTML = allTagsHTML;
        tagList.innerHTML = templates.tagCloudLink(allTagsData);
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
        const allLinks = document.querySelectorAll(select.all.linksTo.tags);

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
        const articles = document.querySelectorAll(select.all.articles);
        
        /* START LOOP: for every article: */
        for(let article of articles){

            /* [DONE] find author wrapper */
            const authorWrapper = article.querySelector(select.article.author);
            let html = '';

            /* [DONE] get author from data-author attribute */
            const articleAuthor = article.getAttribute('data-author');

            //const linkHTML = '<a href="' + articleAuthor + '">by ' + articleAuthor + '</a>';
            const linkHTMLData = { id: articleAuthor, title: articleAuthor };
            const linkHTML = templates.authorLink(linkHTMLData);

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
        const authorList = document.querySelector(select.listOf.authors);

        const authorParams = calculateTagsParams(allAuthors);

        //let allAuthorsHTML = '';
        let allAuthorsData = {authors: []};

        for (let articleAuthor in allAuthors) {
            //allAuthorsHTML += '<li><a href="' + articleAuthor + '">' + articleAuthor + ' (' + allAuthors[articleAuthor] + ')' + '</a></li>';
            allAuthorsData.authors.push({
                author: articleAuthor,
                count: allAuthors[articleAuthor],
                className: calculateTagClass(allAuthors[articleAuthor], authorParams)
            });
        }
        authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
    };

    generateAuthors();

    const authorClickHandler = function(event){
        
        /* [DONE] prevent default action for this event */
        event.preventDefault();

        /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;

        /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');
        console.log(href);

        /* [DONE] make a new constant "author" and extract tag from the "href" constant */
        const author = href.replace('by ' , '');
        
        /* [DONE] find all author links with class active */
        const activeAuthors = document.querySelectorAll(select.article.author, 'a.active');
        
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
        const allLinks = document.querySelectorAll(select.all.linksTo.authors);

        /* [DONE] START LOOP: for each link */
        for(let allLink of allLinks){

            /* [DONE] add authorClickHandler as event listener for that link */
            allLink.addEventListener('click', authorClickHandler);

        /* [DONE] END LOOP: for each link */
        }
    };

    addClickListenersToAuthors();
}