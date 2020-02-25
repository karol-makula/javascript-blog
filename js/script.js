{
    'use strict';

    const titleClickHandler = function() {

        event.preventDefault();

        const clickedElement = this;
        
        /* [DONE] remove class 'active' from all article links */

        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        /* [DONE] add class 'active' to the clicked link */

        clickedElement.classList.add('active');

        /* [DONE] remove class 'active' from all articles */

        const activeArticles = document.querySelectorAll('.post.active');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }

        /* [DONE] get 'href' attribute from the clicked link */

        const articleSelector = clickedElement.getAttribute('href');

        /* [DONE] find the correct article using the selector (value of 'href' attribute) */

        const targetArticle = document.querySelector(articleSelector);

        /* [DONE] add class 'active' to the correct article */

        targetArticle.classList.add('active');
    }

    const optArticleSelector = '.post';
    optTitleSelector = '.post-title';
    optTitleListSelector = '.titles';
    optArticleTagsSelector = '.post-tags .list';
    optArticleAuthorSelector = '.post-author';

    function generateTitleLinks(customSelector = '') {
        
        /* [DONE] remove contents of titleList */

        const titleList = document.querySelector(optTitleListSelector);

        function clearTitleList() {
            titleList.innerHTML = '';
        }

        /* [DONE] find all the articles and save them to variable: articles */

        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        
        /* [DONE] for each article */
        
        let html = '';

        for (let article of articles) {

            /* [DONE] get the article id */

            const articleId = article.getAttribute('id');

            /* [DONE] find the title element & get the title from the title element */
            
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* [DONE] create HTML of the link */

            const linkHTML = '<li> <a href="#' + articleId + '"> <span>' + articleTitle + '</span> </a> </li>';

            /* [DONE] insert link into titleList */

            html = html + linkHTML;
        }

        titleList.innerHTML = html;

        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }
    }

    generateTitleLinks();

    function generateTags() {

        /* [DONE] find all articles */

        const articles = document.querySelectorAll(optArticleSelector);

        /* [DONE] START LOOP: for every article: */

        for (let article of articles) {

            /* [DONE] find tags wrapper */

            const tagList = article.querySelector(optArticleTagsSelector);

            /* [DONE] make html variable with empty string */

            let html = '';

            /* [DONE] get tags from data-tags attribute */
            
            const articleTags = article.getAttribute('data-tags');
            
            /* [DONE] split tags into array */

            const articleTagsArray = articleTags.split(' ');

            /* [DONE] START LOOP: for each tag */

            for (let tag of articleTagsArray) {

                /* [DONE] generate HTML of the link */

                const linkHTML = '<li> <a href="#tag-' + tag + '">' +  tag  + '</a> </li> ';

                /* [DONE] add generated code to html variable */

                html = html + linkHTML;

            /* [DONE] END LOOP: for each tag */
            }

            /* [DONE] insert HTML of all the links into the tags wrapper */

            tagList.innerHTML = html;

        /* [DONE] END LOOP: for every article: */
        }
    }

    generateTags();

    function tagClickHandler(event) {

        /* [DONE] prevent default action for this event */

        event.preventDefault();
      
        /* [DONE] make new constant named "clickedElement" and give it the value of "this" */

        const clickedElement = this;
    
        /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */

        const href = clickedElement.getAttribute('href');
     
        /* [DONE] make a new constant "tag" and extract tag from the "href" constant */

        const tag = href.replace('#tag-', '');
      
        /* [DONE] find all tag links with class active */

        const tagsActiveClass = document.querySelectorAll('a.active[href^="#tag-"]');
  
        /* [DONE] START LOOP: for each active tag link */

        for (let tagActiveClass of tagsActiveClass) {
      
            /* [DONE] remove class active */

            tagActiveClass.classList.remove('active');

        /* END LOOP: for each active tag link */
        }
      
        /* [DONE] find all tag links with "href" attribute equal to the "href" constant */

        const allTagsLinks = document.querySelectorAll('a[href="' + href + '"]');
      
        /* [DONE] START LOOP: for each found tag link */

        for (let allTagLink of allTagsLinks){
      
            /* [DONE] add class active */
            
            allTagLink.classList.add('active');

        /* END LOOP: for each found tag link */

        }
      
        /* [DONE] execute function "generateTitleLinks" with article selector as argument */

        generateTitleLinks('[data-tags~="' + tag + '"]');

    }


      
    function addClickListenersToTags() {

        /* [DONE] find all links to tags */

        const tagsLinks = document.querySelectorAll('.post-tags a');
   
        /* [DONE] START LOOP: for each link */

        for (link of tagsLinks){
      
            /* [DONE] add tagClickHandler as event listener for that link */

            link.addEventListener('click', tagClickHandler);
      
        /* END LOOP: for each link */
        }
    }
      
    addClickListenersToTags();

    function generateAuthors() {

        /* [DONE] find all articles */

        const articles = document.querySelectorAll(optArticleSelector);

        /* [DONE] START LOOP: for every article: */

        for (let article of articles) {

            /* [DONE] find author wrapper */

            const authorWrapper = article.querySelector(optArticleAuthorSelector);

            /* [DONE] make html variable with empty string */

            let html = '';

            /* [DONE] get author from data-author attribute */
            
            const articleAuthors = article.getAttribute('data-author');

            /* [DONE] generate HTML of the link */

            const linkHTML = 'by ' + '<a href="#' + articleAuthors + '">' + articleAuthors  + '</a>';

            /* [DONE] add generated code to html variable */

            html = html + linkHTML;

            /* [DONE] insert HTML of all the links into the author wrapper */

            authorWrapper.innerHTML = html;

        /* [DONE] END LOOP: for every article: */
        }
    }

    generateAuthors();
}