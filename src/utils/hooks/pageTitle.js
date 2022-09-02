import { useEffect, useState } from "react";
import { getPageDetails } from "App/App";

import ReactGA from 'react-ga';

function usePageTitle(defaultTitle) {
    const [oldTitle] = useState(document.title);
    const [title, setTitle] = useState(defaultTitle);

    const [name] = getPageDetails();

    useEffect(() => {
        if (title) {
            document.title = title.replace("{{name}}", name);

            if (window.location.hostname !== 'localhost') {
                ReactGA.pageview("/virtual" + window.location.pathname + window.location.search);
            }
        } else {
            document.title = "Loading... | " + name;
        }

        return () => {
            document.title = oldTitle;
        }
    }, [title, oldTitle, name]);

    return setTitle;
}

export default usePageTitle