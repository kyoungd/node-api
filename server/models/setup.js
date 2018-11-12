const { get, post } = require('./api');
const { bankAccountIndex, bankAccountId, entityId, refModel, suffix } = require('./setup-helper');

const doexist = async (model) => {
    const cr = await get(model);
    const result = (!cr || cr.data.length <= 0) ? false : true;
    return result;
}

const bankaccount = async () => {
    for (i=1; i < 30; ++i) {
        let data = 
            {
                "$class": "org.acme.smartdonation.util.BankAccount",
                "entityId": bankAccountId(i),
                "accountNumber": "1234-123-10" + suffix(i),
                "routingNumber": "123412-310" + suffix(i),
                "note": "string",
                "status": "ACTIVE",
                "createdOn": "2018-11-09T17:54:40.051Z"
            }
        await post ('bankaccount', data);
    }
}

const participant = async () => {
    if (!doexist('customer')) {
        const customerData = 
        {
            "$class": "org.acme.smartdonation.participant.Customer",
            "name": "Red Cross",
            "participantId": entityId('c'),
            "phoneNumber": "555-123-1234",
            "email": "bill@redcross.com",
            "note": "Be Christ like. Serve all.",
            "status": "ACTIVE",
            "access": {
                "$class": "org.acme.smartdonation.participant.RoleAccess",
                "isRead": "false",
                "isWrite": "false",
                "isAccountOnly": "false",
                "isDepartmentOnly": "false",
                "isAll": "true"
            }
        }
        await post('customer', customerData);
    }
    if (!doexist('donor')) {
        const donorData =
        {
            "$class": "org.acme.smartdonation.participant.Donor",
            "name": "Bill Gates",
            "participantId": entityId('d'),
            "phoneNumber": "555-123-1234",
            "email": "bill@microsoft.com",
            "note": "donate to chnage the world",
            "status": "ACTIVE",
            "access": {
                "$class": "org.acme.smartdonation.participant.RoleAccess",
                "isRead": "false",
                "isWrite": "false",
                "isAccountOnly": "false",
                "isDepartmentOnly": "false",
                "isAll": "true",
            },
            "customer": `resource:org.acme.smartdonation.participant.Customer#${entityId('c')}`,
            "bankAccount": `resource:org.acme.smartdonation.util.BankAccount#${bankAccountId(bankAccountIndex('donor'))}`,
        }
        await post('donor', donorData);
    }
    if (!doexist('supplier')) {
        for (let ix=1; ix < 10; ++ix) {
            let supplier =
            {
                "$class": "org.acme.smartdonation.participant.Supplier",
                "name": "Bill Gates",
                "participantId": entityId('s', ix),
                "phoneNumber": "555-123-1234",
                "email": "bill@microsoft.com",
                "note": "donate to chnage the world",
                "status": "ACTIVE",
                "access": {
                    "$class": "org.acme.smartdonation.participant.RoleAccess",
                    "isRead": "false",
                    "isWrite": "false",
                    "isAccountOnly": "false",
                    "isDepartmentOnly": "false",
                    "isAll": "true"
                },
                "customer": `resource:org.acme.smartdonation.participant.Customer#${entityId('c')}`,
                "bankAccount": `resource:org.acme.smartdonation.util.BankAccount#${bankAccountId(bankAccountIndex('supplier') + ix - 1)}`
            }
            await post('supplier', supplier);
        }
    }
}

const donation = async () => {
    const donation1 = {
        "$class": "org.acme.smartdonation.object.Donation",
        "entityId": entityId('t', 1),
        "name": "Factual ads only",
        "description": "Proposing to restore the state’s commitment to fund two-thirds of public school costs, matching a plan by his Democratic opponent, State Superintendent Tony Evers.",
        "rules": ['factual advertisements', 'focus on the candidate', 'candidates accomplishments'],
        "note": "More than 250,000 people have been forced to flee their homes to avoid three major blazes in the state. Firefighters were powerless in stopping a wildfire destroying the northern town of Paradise, where nine people died and 35 are missing. A raging wildfire swept into the southern beach resort of Malibu - home to many Hollywood stars - on Friday.",
        "donateOn": "2016-11-10T19:05:41.190Z",
        "amount": 4000000,
        "availableOn": "2016-11-10T19:05:41.190Z",
        "expirationOn": "2018-11-10T19:05:41.190Z",
        "status": "ACTIVE",
        "isExpired": "true",
        "isDonationLeft": "false",
        "isDonationSuccess": "true",
        "isDonationPartialSuccess": "false",
        "isDonationReturned": "false",
        "isDonationReturnMust": "true",
        "bankAccount": refModel('bankaccount', 1, 'donation'),
        "donor": refModel('donor'),
        "customer": refModel('customer'),
    }
    await post('donation', donation1);
    const donation2 = {
        "$class": "org.acme.smartdonation.object.Donation",
        "entityId": entityId('t', 2),
        "name": "Humours and postive ads only for senate and governor",
        "description": "Gov. Scott Walker is proposing to restore the state’s commitment to fund two-thirds of public school costs, matching a plan by his Democratic opponent, State Superintendent Tony Evers.",
        "rules": ['postive ads only', 'it must represent light site of the candidate', 'focus on the candidate', 'candidates accomplishments'],
        "note": "Authorities say the Camp Fire in the north and the Woolsey Fire and Hill Fire in the south are being fanned by strong winds and dry forests. By Saturday, the Woolsey Fire had doubled in size, officials said. The magnitude of the destruction of the fire is unbelievable and heartbreaking, said Mark Ghilarducci, of the California governor's office.",
        "donateOn": "2018-11-10T19:05:41.190Z",
        "amount": 5000000,
        "availableOn": "2018-11-10T19:05:41.190Z",
        "expirationOn": "2020-11-10T19:05:41.190Z",
        "status": "ACTIVE",
        "isExpired": "false",
        "isDonationLeft": "false",
        "isDonationSuccess": "false",
        "isDonationPartialSuccess": "false",
        "isDonationReturned": "false",
        "isDonationReturnMust": "true",
        "bankAccount": refModel('bankaccount', 2, 'donation'),
        "donor": refModel('donor'),
        "customer": refModel('customer'),
    }
    await post('donation', donation2)
}

const campaign = async () => {
    const c1 = {
        "$class": "org.acme.smartdonation.object.Campaign",
        "entityId": entityId('campaign', 1),
        "name": "Campaign Factual.",
        "description": "Campaign that only highlights facts",
        "amount": 4000000,
        "status": "COMPLETE",
        "createdOn": "2016-11-10T19:05:41.084Z",
        "customer": refModel('customer'),
        "donor": refModel('donor'),
        "donation": refModel('donation', 1),
        "bankAccount": refModel('bankaccount', 1, 'campaign'),
    }
    await post('campaign', c1);
    const c2 = {
        "$class": "org.acme.smartdonation.object.Campaign",
        "entityId": entityId('campaign', 2),
        "name": "Positive and humours ads.",
        "description": "Campaign that only focus on positives",
        "amount": 5000000,
        "status": "ACTIVE",
        "createdOn": "2018-10-10T19:05:41.084Z",
        "customer": refModel('customer'),
        "donor": refModel('donor'),
        "donation": refModel('donation', 2),
        "bankAccount": refModel('bankaccount', 2, 'campaign'),
    }
    await post('campaign', c2);
}

const campaignrequest = async() => {
    for (ix = 1; ix <= 4; ++ix) {
        let cr1 = {
            "$class": "org.acme.smartdonation.object.CampaignRequest",
            "entityId": entityId('campaignrequest', ix),
            "amount": 1000000,
            "createdOn": "2016-11-10T19:05:41.130Z",
            "description": "In the plastic container, which is around the same size as a small box of photocopier paper, she has bottles of tonic water, coffee and French marmalade. Away from the kitchen, in a cupboard she has stored extra bottles of shampoo.",
            "name": "Factual Ad",
            "requestStatus": "ACCEPTED",
            "requestStatusReason": "OK",
            "respondedOn": "2018-11-10T19:05:41.130Z",
            "status": "COMPLETE",
            "campaign": refModel('campaign', 1),
            "customer": refModel('customer'),
            "donation": refModel('donation', 1),
            "donor": refModel('donor'),
            "supplier": refModel('supplier', ix)
        }
        await post('campaignrequest', cr1);
        let cr2 = {
            "$class": "org.acme.smartdonation.object.CampaignRequest",
            "entityId": entityId('campaignrequest', ix + 4),
            "amount": 1250000,
            "createdOn": "2016-11-10T19:05:41.130Z",
            "description": "The idea that we might not be able to shop as normal in the immediate aftermath of Brexit seems ludicrous. When I asked on Twitter if anyone was putting aside goods, I was accused of scaremongering. What a ridiculous tweet, do people actually think were going back to the stone age immediately after Brexit? was one scathing response.",
            "name": "Postive and humorous Ad",
            "requestStatus": "ACCEPTED",
            "requestStatusReason": "OK",
            "respondedOn": "2018-11-10T19:05:41.130Z",
            "status": "COMPLETE",
            "campaign": refModel('campaign', 2),
            "customer": refModel('customer'),
            "donation": refModel('donation', 2),
            "donor": refModel('donor'),
            "supplier": refModel('supplier', ix)
        }
        await post('campaignrequest', cr2);
    }
}

const product = async () => {
    for (ix = 1; ix <= 6; ++ix) {
        let item =
        {
            "$class": "org.acme.smartdonation.object.Product",
            "entityId": entityId('product', ix),
            "approvalResponse": "OK",
            "approvalStatus": "ACCEPTED",
            "createdOn": "2016-11-11T00:35:41.037Z",
            "description": "This is a factual ad only",
            "excerpt": "string",
            "html": "string",
            "name": "string",
            "note": "It went pretty well.  No surprises.",
            "status": "COMPLETE",
            "submittedForApprovalOn": "2018-11-11T00:35:41.037Z",
            "video": "string",
            "campaign": refModel('campaign', 1),
            "campaignRequest": refModel('campaignrequest', ix),
            "customer": refModel('customer'),
            "donation": refModel('donation', 1),
            "donor": refModel('donor'),
            "supplier": refModel('supplier', ix)
        }
        switch(ix) {
            case 1:
                item.excerpt = "Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf…";
                item.html = "<p>Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim.</p>\n<div class=\"gatsby-highlight\" data-language=\"js\"><pre class=\"language-js\"><code class=\"language-js\"><span class=\"token punctuation\">(</span><span class=\"token keyword\">function</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n\n<span class=\"token keyword\">var</span> cache <span class=\"token operator\">=</span> <span class=\"token punctuation\">{</span><span class=\"token punctuation\">}</span><span class=\"token punctuation\">;</span>\n<span class=\"token keyword\">var</span> form <span class=\"token operator\">=</span> <span class=\"token function\">$</span><span class=\"token punctuation\">(</span><span class=\"token string\">'form'</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n<span class=\"token keyword\">var</span> minified <span class=\"token operator\">=</span> <span class=\"token boolean\">true</span><span class=\"token punctuation\">;</span>\n\n<span class=\"token keyword\">var</span> dependencies <span class=\"token operator\">=</span> <span class=\"token punctuation\">{</span><span class=\"token punctuation\">}</span><span class=\"token punctuation\">;</span>\n\n<span class=\"token keyword\">var</span> treeURL <span class=\"token operator\">=</span> <span class=\"token string\">'https://api.github.com/repos/PrismJS/prism/git/trees/gh-pages?recursive=1'</span><span class=\"token punctuation\">;</span>\n<span class=\"token keyword\">var</span> treePromise <span class=\"token operator\">=</span> <span class=\"token keyword\">new</span> <span class=\"token class-name\">Promise</span><span class=\"token punctuation\">(</span><span class=\"token keyword\">function</span><span class=\"token punctuation\">(</span>resolve<span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n\t$u<span class=\"token punctuation\">.</span><span class=\"token function\">xhr</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">{</span>\n\t\turl<span class=\"token punctuation\">:</span> treeURL<span class=\"token punctuation\">,</span>\n\t\tcallback<span class=\"token punctuation\">:</span> <span class=\"token keyword\">function</span><span class=\"token punctuation\">(</span>xhr<span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n\t\t\t<span class=\"token keyword\">if</span> <span class=\"token punctuation\">(</span>xhr<span class=\"token punctuation\">.</span>status <span class=\"token operator\">&lt;</span> <span class=\"token number\">400</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n\t\t\t\t<span class=\"token function\">resolve</span><span class=\"token punctuation\">(</span><span class=\"token constant\">JSON</span><span class=\"token punctuation\">.</span><span class=\"token function\">parse</span><span class=\"token punctuation\">(</span>xhr<span class=\"token punctuation\">.</span>responseText<span class=\"token punctuation\">)</span><span class=\"token punctuation\">.</span>tree<span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n\t\t\t<span class=\"token punctuation\">}</span>\n\t\t<span class=\"token punctuation\">}</span>\n\t<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span></code></pre></div>\n<p>Zwei flinke Boxer jagen die quir</p>\n<div class=\"gatsby-highlight\" data-language=\"md\"><pre class=\"language-md\"><code class=\"language-md\"># asdfasdfads\n\n- auesufuaus</code></pre></div>\n<div class=\"gatsby-highlight\" data-language=\"css\"><pre class=\"language-css\"><code class=\"language-css\"><span class=\"token selector\">code[class*=\"language-\"],\npre[class*=\"language-\"]</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token property\">color</span><span class=\"token punctuation\">:</span> black<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">background</span><span class=\"token punctuation\">:</span> none<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">font-family</span><span class=\"token punctuation\">:</span> Consolas, Monaco, <span class=\"token string\">\"Andale Mono\"</span>, <span class=\"token string\">\"Ubuntu Mono\"</span>, monospace<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">text-align</span><span class=\"token punctuation\">:</span> left<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">white-space</span><span class=\"token punctuation\">:</span> pre<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">word-spacing</span><span class=\"token punctuation\">:</span> normal<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">word-break</span><span class=\"token punctuation\">:</span> normal<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">word-wrap</span><span class=\"token punctuation\">:</span> normal<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">line-height</span><span class=\"token punctuation\">:</span> 1.5<span class=\"token punctuation\">;</span>\n\n  <span class=\"token property\">-moz-tab-size</span><span class=\"token punctuation\">:</span> 4<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">-o-tab-size</span><span class=\"token punctuation\">:</span> 4<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">tab-size</span><span class=\"token punctuation\">:</span> 4<span class=\"token punctuation\">;</span>\n\n  <span class=\"token property\">-webkit-hyphens</span><span class=\"token punctuation\">:</span> none<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">-moz-hyphens</span><span class=\"token punctuation\">:</span> none<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">-ms-hyphens</span><span class=\"token punctuation\">:</span> none<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">hyphens</span><span class=\"token punctuation\">:</span> none<span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span></code></pre></div>";
                item.name = "product 1";
                item.video = "<iframe width='560' height='315' allowfullscreen style='margin-bottom:0' src='https://www.youtube.com/embed/ys5p3WzVfSs?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=39a3bd' data-fit='yes' frameborder='0' id='fitvid452431'></iframe>";
                break;
            case 2:
                item.excerpt = "Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf…";
                item.html = "<p>Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim.</p>\n<p>Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.</p>\n<h2 id=\"zwei-flinke-boxer\"><a href=\"#zwei-flinke-boxer\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Zwei flinke Boxer</h2>\n<p>Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark.</p>\n<blockquote>\n<p>\"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.</p>\n</blockquote>\n<p>Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß.</p>";
                item.name = "product 2";
                item.video = "<iframe width='560' height='315' allowfullscreen style='margin-bottom:0' src='https://www.youtube.com/embed/6UYurrW7GVg?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=39a3bd' data-fit='yes' frameborder='0' id='fitvid869049'></iframe>";
                break;
            case 3:
                item.excerpt = "Heading 1 Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern…";
                item.html = "<p>Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim.</p>\n<p>Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.</p>\n<h2 id=\"zwei-flinke-boxer\"><a href=\"#zwei-flinke-boxer\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Zwei flinke Boxer</h2>\n<p>Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark.</p>\n<blockquote>\n<p>\"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.</p>\n</blockquote>\n<p>Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß.</p>";
                item.name = "product 3";
                item.video = "<iframe width='560' height='315' allowfullscreen style='margin-bottom:0' src='https://www.youtube.com/embed/N6dlPK4z-8U?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=39a3bd' data-fit='yes' frameborder='0' id='fitvid53925'></iframe>";
                break;
            case 4:
                item.excerpt = "Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf…";
                item.html = "<p>Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim.</p>\n<p>Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.</p>\n<h2 id=\"zwei-flinke-boxer\"><a href=\"#zwei-flinke-boxer\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Zwei flinke Boxer</h2>\n<p>Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark.</p>\n<blockquote>\n<p>\"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.</p>\n</blockquote>\n<p>Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß.</p>";
                item.name = "product 4";
                item.video = "<iframe width='560' height='315' allowfullscreen style='margin-bottom:0' src='https://www.youtube.com/embed/wPD7OJ7NhvU?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=39a3bd' data-fit='yes' frameborder='0' id='fitvid814356'></iframe>";
                break;
            case 5:
                item.campaign = refModel('campaign', 2);
                item.donation = refModel('donation', 2);
                item.approvalStatus = "CONSIDERING";
                item.status = "ACTIVE";
                item.excerpt = "View raw (TEST.md) This is a paragraph. Header 1 Header 2 Header 1 Header 2 Header 3 Header 4 Header 5 Header 6 Header 1 Header 2 Header…";
                item.html = "<p><a href=\"https://raw.github.com/adamschwartz/github-markdown-kitchen-sink/master/README.md\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">View raw (TEST.md)</a></p>\n<p>This is a paragraph.</p>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">This is a paragraph.</code></pre></div>\n<h1 id=\"header-1\"><a href=\"#header-1\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 1</h1>\n<h2 id=\"header-2\"><a href=\"#header-2\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 2</h2>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">Header 1\n========\n\nHeader 2\n--------</code></pre></div>\n<h1 id=\"header-1-1\"><a href=\"#header-1-1\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 1</h1>\n<h2 id=\"header-2-1\"><a href=\"#header-2-1\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 2</h2>\n<h3 id=\"header-3\"><a href=\"#header-3\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 3</h3>\n<h4 id=\"header-4\"><a href=\"#header-4\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 4</h4>\n<h5 id=\"header-5\"><a href=\"#header-5\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 5</h5>\n<h6 id=\"header-6\"><a href=\"#header-6\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 6</h6>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\"># Header 1\n## Header 2\n### Header 3\n#### Header 4\n##### Header 5\n###### Header 6</code></pre></div>\n<h1 id=\"header-1-2\"><a href=\"#header-1-2\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 1</h1>\n<h2 id=\"header-2-2\"><a href=\"#header-2-2\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 2</h2>\n<h3 id=\"header-3-1\"><a href=\"#header-3-1\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 3</h3>\n<h4 id=\"header-4-1\"><a href=\"#header-4-1\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 4</h4>\n<h5 id=\"header-5-1\"><a href=\"#header-5-1\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 5</h5>\n<h6 id=\"header-6-1\"><a href=\"#header-6-1\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Header 6</h6>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\"># Header 1 #\n## Header 2 ##\n### Header 3 ###\n#### Header 4 ####\n##### Header 5 #####\n###### Header 6 ######</code></pre></div>\n<blockquote>\n<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.</p>\n</blockquote>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">&gt; Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.</code></pre></div>\n<blockquote>\n                <h2 id=\"this-is-a-header\"><a href=\"#this-is-a-header\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>This is a header.</h2>\n<ol>\n<li>This is the first list item.</li>\n<li>This is the second list item.</li>\n</ol>\n<p>Here's some example code:</p>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">Markdown.generate();</code></pre></div>\n</blockquote>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">&gt; ## This is a header.\n&gt; 1. This is the first list item.\n&gt; 2. This is the second list item.\n&gt;\n&gt; Here&#39;s some example code:\n&gt;\n&gt;     Markdown.generate();</code></pre></div>\n<ul>\n<li>\n<p>Red</p>\n</li>\n<li>\n<p>Green</p>\n</li>\n<li>\n<p>Blue</p>\n</li>\n<li>\n<p>Red</p>\n</li>\n<li>\n<p>Green</p>\n</li>\n<li>\n<p>Blue</p>\n</li>\n<li>\n<p>Red</p>\n</li>\n<li>\n<p>Green</p>\n</li>\n<li>\n<p>Blue</p>\n</li>\n</ul>\n<div class=\"gatsby-highlight\" data-language=\"markdown\"><pre class=\"language-markdown\"><code class=\"language-markdown\"><span class=\"token list punctuation\">-</span> Red\n<span class=\"token list punctuation\">-</span> Green\n<span class=\"token list punctuation\">-</span> Blue\n\n<span class=\"token list punctuation\">*</span> Red\n<span class=\"token list punctuation\">*</span> Green\n<span class=\"token list punctuation\">*</span> Blue\n\n<span class=\"token list punctuation\">-</span> Red\n<span class=\"token list punctuation\">-</span> Green\n<span class=\"token list punctuation\">-</span> Blue</code></pre></div>\n<ol>\n<li>Buy flour and salt</li>\n<li>Mix together with water</li>\n<li>Bake</li>\n</ol>\n<div class=\"gatsby-highlight\" data-language=\"markdown\"><pre class=\"language-markdown\"><code class=\"language-markdown\"><span class=\"token list punctuation\">1.</span> Buy flour and salt\n<span class=\"token list punctuation\">1.</span> Mix together with water\n<span class=\"token list punctuation\">1.</span> Bake</code></pre></div>\n<p>Paragraph:</p>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">Code</code></pre></div>\n<!-- -->\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">Paragraph:\n\n    Code</code></pre></div>\n<hr>\n<hr>\n<hr>\n<hr>\n<hr>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">* * *\n\n***\n\n*****\n\n- - -\n\n---------------------------------------</code></pre></div>\n<p>This is <a href=\"http://example.com\" title=\"Example\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">an example</a> link.</p>\n<p><a href=\"http://example.com\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">This link</a> has no title attr.</p>\n<p>This is <a href=\"http://example.com\" title=\"Optional Title\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">an example</a> reference-style link.</p>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">This is [an example](http://example.com &quot;Example&quot;) link.\n\n[This link](http://example.com) has no title attr.\n\nThis is [an example] [id] reference-style link.\n\n[id]: http://example.com &quot;Optional Title&quot;</code></pre></div>\n<p><em>single asterisks</em></p>\n<p><em>single underscores</em></p>\n<p><strong>double asterisks</strong></p>\n<p><strong>double underscores</strong></p>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">*single asterisks*\n\n_single underscores_\n\n**double asterisks**\n\n__double underscores__</code></pre></div>\n<p>This paragraph has some <code class=\"language-text\">code</code> in it.</p>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">This paragraph has some `code` in it.</code></pre></div>\n<p><img src=\"https://placehold.it/200x50\" alt=\"Alt Text\" title=\"Image Title\"></p>\n<div class=\"gatsby-highlight\" data-language=\"text\"><pre class=\"language-text\"><code class=\"language-text\">![Alt Text](https://placehold.it/200x50 &quot;Image Title&quot;)</code></pre></div>",
                item.name = "product 5";
                item.video = "<iframe width='560' height='315' allowfullscreen style='margin-bottom:0' src='https://www.youtube.com/embed/kCxj68UgfmI?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=39a3bd' data-fit='yes' frameborder='0' id='fitvid90951'></iframe>";
                break;
            case 6:
                item.campaign = refModel('campaign', 2);
                item.donation = refModel('donation', 2);
                item.approvalStatus = "ACCEPTED";
                item.status = "COMPLETE";
                item.excerpt = "View raw (TEST.md) This is a paragraph. Header 1 Header 2 Header 1 Header 2 Header 3 Header 4 Header 5 Header 6 Header 1 Header 2 Header…";
                item.html = "<p>Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim.</p>\n<p>Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.</p>\n<h2 id=\"zwei-flinke-boxer\"><a href=\"#zwei-flinke-boxer\" aria-hidden class=\"anchor\"><svg aria-hidden=\"true\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path fill-rule=\"evenodd\" d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Zwei flinke Boxer</h2>\n<p>Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark.</p>\n<blockquote>\n<p>\"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.</p>\n</blockquote>\n<p>Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg. Heizölrückstoßabdämpfung. Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. \"Fix, Schwyz! \" quäkt Jürgen blöd vom Paß.</p>";
                item.name = "product 6";
                item.video = "<iframe width='560' height='315' allowfullscreen style='margin-bottom:0' src='https://www.youtube.com/embed/AXjaoOnTZXQ?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=39a3bd' data-fit='yes' frameborder='0' id='fitvid235058'></iframe>";
                break;
        }
        await post('product', item);
    }
}

const all = async () => {
    !(await doexist('bankaccount')) ? await bankaccount() : null;
    await participant();
    !(await doexist('donation')) ? await donation() : null;
    !(await doexist('campaign')) ? await campaign() : null;
    !(await doexist('campaignrequest')) ? await campaignrequest() : null;
    !(await doexist('product')) ? await product() : null;
}

module.exports = { all }
