{
    'use strict';

    const templates = {
        articleLink: Handlebars.compile(
            document.querySelector('#template-article-link').innerHTML
        ),
        tagLink: Handlebars.compile(
            document.querySelector('#template-tag-link').innerHTML
        ),
        authorLink: Handlebars.compile(
            document.querySelector('#template-author-link').innerHTML
        ),
        tagCloudLink: Handlebars.compile(
            document.querySelector('#template-tag-cloud-link').innerHTML
        ),
        authorCloudLink: Handlebars.compile(
            document.querySelector('#template-author-cloud-link').innerHTML
        ),
    };

    const optArticleSelector = '.post';
    optTitleSelector = '.post-title';
    optTitleListSelector = '.titles';
    optArticleTagsSelector = '.post-tags .list';
    optArticleAuthorSelector = '.post-author';
    optTagsListSelector = '.tags.list';
    optCloudClassCount = "5";
    optCloudClassPrefix = "tag-size-";
    optAuthorsListSelector = '.authors.list';

    const titleClickHandler = function() {

        event.preventDefault();

        const clickedElement = this;
        
        /* remove class 'active' from all article links */

        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        /* add class 'active' to the clicked link */

        clickedElement.classList.add('active');

        /* remove class 'active' from all articles */

        const activeArticles = document.querySelectorAll('.post.active');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }

        /* get 'href' attribute from the clicked link */

        const articleSelector = clickedElement.getAttribute('href');

        /* find the correct article using the selector (value of 'href' attribute) */

        const targetArticle = document.querySelector(articleSelector);

        /* add class 'active' to the correct article */

        targetArticle.classList.add('active');
    }

    function generateTitleLinks(customSelector = '') {
        
        /* remove contents of titleList */

        const titleList = document.querySelector(optTitleListSelector);

        function clearTitleList() {
            titleList.innerHTML = '';
        }

        /* find all the articles and save them to variable: articles */

        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        
        /* for each article */
        
        let html = '';

        for (let article of articles) {

            /* get the article id */

            const articleId = article.getAttribute('id');

            /* find the title element & get the title from the title element */
            
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* create HTML of the link */

            const linkHTMLData = { id: articleId, title: articleTitle };
            const linkHTML = templates.articleLink(linkHTMLData);

            /* insert link into titleList */

            html = html + linkHTML;
        }

        titleList.innerHTML = html;

        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }
    }

    generateTitleLinks();

    function calculateTagsParams(tags) {
        const params = {
            min: 999999,
            max: 0
        }

        for (let tag in tags) {
            if (tags[tag] > params.max) {
                params.max = tags[tag];
            }

            if (tags[tag] < params.min) {
                params.min = tags[tag]
            }
        }
        return params;
    };

    function calculateTagClass(count, params) {
        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min;
        const percentage = normalizedCount / normalizedMax;
        const classNumber = Math.floor (percentage * (optCloudClassCount - 1) + 1);
        return classNumber;
    }

    function generateTags() {

        /* create a new variable allTags with an empty array */

        let allTags = {};

        /* find all articles */

        const articles = document.querySelectorAll(optArticleSelector);

        /* START LOOP: for every article: */

        for (let article of articles) {

            /* find tags wrapper */

            const tagsWrapper = article.querySelector(optArticleTagsSelector);

            /* make html variable with empty string */

            let html = '';

            /* get tags from data-tags attribute */
            
            const articleTags = article.getAttribute('data-tags');
            
            /* split tags into array */

            const articleTagsArray = articleTags.split(' ');

            /* START LOOP: for each tag */

            for (let tag of articleTagsArray) {

                /* generate HTML of the link */

                const linkHTMLData = { id: tag, title: tag };
                const linkHTML = templates.tagLink(linkHTMLData);

                /* add generated code to html variable */

                html = html + linkHTML;

                /* check if this link is NOT already in allTags */

                if (!allTags[tag]) {
                
                    /* add generated code to allTags array */

                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }

            /* END LOOP: for each tag */
            }

            /* insert HTML of all the links into the tags wrapper */

            tagsWrapper.innerHTML = html;

        /*   END LOOP: for every article: */        
        }

        /* find list of tags in right column */

        const tagList = document.querySelector('.tags');

        /* create variable for all links HTML code */

        const tagsParams = calculateTagsParams(allTags);

        const allTagsData = {tags: []};

        /* START LOOP: for each tag in allTags: */
        
        for (let tag in allTags) {

            /* generate code of a link and add it to allTagsHTML */

            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                className: calculateTagClass(allTags[tag], tagsParams)
            });

        /* END LOOP: for each tag in allTags: */        
        }

        /* add HTML from allTagsHTML to tagList */

        tagList.innerHTML = templates.tagCloudLink(allTagsData);      
    }

    generateTags();

    function tagClickHandler(event) {

        /* prevent default action for this event */

        event.preventDefault();
      
        /* make new constant named "clickedElement" and give it the value of "this" */

        const clickedElement = this;
    
        /* make a new constant "href" and read the attribute "href" of the clicked element */

        const href = clickedElement.getAttribute('href');
     
        /* make a new constant "tag" and extract tag from the "href" constant */

        const tag = href.replace('#tag-', '');
      
        /* find all tag links with class active */

        const tagsActiveClass = document.querySelectorAll('a.active[href^="#tag-"]');
  
        /* START LOOP: for each active tag link */

        for (let tagActiveClass of tagsActiveClass) {
      
            /* remove class active */

            tagActiveClass.classList.remove('active');

        /* END LOOP: for each active tag link */        
        }
      
        /* find all tag links with "href" attribute equal to the "href" constant */

        const equalTags = document.querySelectorAll('a[href="' + href + '"]');
      
        /* START LOOP: for each found tag link */

        for (let equalTag of equalTags) {
      
            /* add class active */
            
            equalTag.classList.add('active');

        /* END LOOP: for each found tag link */
        }
      
        /* execute function "generateTitleLinks" with article selector as argument */

        generateTitleLinks('[data-tags~="' + tag + '"]');

    }


      
    function addClickListenersToTags() {

        /* find all links to tags */

        const equalTags = document.querySelectorAll('a[href^="#tag-"]');
   
        /* START LOOP: for each link */

        for (equalTag of equalTags) {
      
            /* add tagClickHandler as event listener for that link */

            equalTag.addEventListener('click', tagClickHandler);
      
        /* END LOOP: for each link */
        }
    }
      
    addClickListenersToTags();

    function generateAuthors() {

        /* create a new variable allAuthorss with an empty array */
        
        let allAuthors = {};

        /* find all articles */

        const articles = document.querySelectorAll(optArticleSelector);

        /* START LOOP: for every article: */

        for (let article of articles) {

            /* find author wrapper */

            const authorWrapper = article.querySelector(optArticleAuthorSelector);

            /* make html variable with empty string */

            let html = '';

            /* get author from data-author attribute */
            
            const articleAuthors = article.getAttribute('data-author');

            /* generate HTML of the link */

            //const linkHTML = '<a href="#' + articleAuthors + '">' + articleAuthors  + '</a>';

            const linkHTMLData = { id: articleAuthors, title: articleAuthors };
            const linkHTML = templates.authorLink(linkHTMLData);

            /* add generated code to html variable */

            html = html + linkHTML;

            /* check if this link is NOT already in allAuthors */

            if (!allAuthors[articleAuthors]) {

                /* add generated code to allAuthors array */

                allAuthors[articleAuthors] = 1;
            } else {
                allAuthors[articleAuthors]++;
            }

            /* insert HTML of all the links into the author wrapper */

            authorWrapper.innerHTML = html;

        /* END LOOP: for every article: */
        }

        /* find list of authors in right column */

        const authorList = document.querySelector('.authors');

        /* create variable for all links HTML code */

        const allAuthorsData = {authors: []};

        /* START LOOP: for each author in allAuthors: */
        
        for (let authorArticle in allAuthors) {

            /* generate code of a link and add it to allTagsHTML */

            allAuthorsData.authors.push({
                author: authorArticle,
                count: allAuthors[authorArticle],
            });

        /* END LOOP: for each author in allAuthors: */
        }

        /* add HTML from allTagsHTML to tagList */

        authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
    }

    generateAuthors();

    function authorClickHandler(event) {

        /* prevent default action for this event */

        event.preventDefault();
      
        /* make new constant named "clickedElement" and give it the value of "this" */

        const clickedElement = this;
    
        /* make a new constant "href" and read the attribute "href" of the clicked element */

        const href = clickedElement.getAttribute('href');
     
        /* make a new constant "author" and extract tag from the "href" constant */

        const author = href.replace('#author-', '');
      
        /* find all authors links with class active */

        const authorsActiveClass = document.querySelectorAll('a[href^="#"]');
  
        /* START LOOP: for each active tag link */

        for (let authorActiveClass of authorsActiveClass) {
      
            /* remove class active */

            authorActiveClass.classList.remove('active');

        /* END LOOP: for each active author link */
        }
      
        /* find all author links with "href" attribute equal to the "href" constant */

        const allAuthorsLinks = document.querySelectorAll('a[href="' + href + '"]');
      
        /* START LOOP: for each found author link */

        for (let allAuthorLink of allAuthorsLinks) {
      
            /* add class active */
            
            allAuthorLink.classList.add('active');

        /* END LOOP: for each found tag link */
        }
      
        /* execute function "generateTitleLinks" with article selector as argument */

        generateTitleLinks('[data-author="' + author + '"]');
    }
      
    function addClickListenersToAuthors() {

        /* find all links to authors */

        const links = document.querySelectorAll('.post-author a, .list.authors a');

        /* START LOOP: for each link */

        for (link of links) {
      
            /* add authorClickHandler as event listener for that link */

            link.addEventListener('click', authorClickHandler);
      
        /* END LOOP: for each link */
        }
    }

    addClickListenersToAuthors();
}