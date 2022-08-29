import * as React from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
export default function Editor() {
    const [value, setValue] = React.useState("**Hello world!!!**");
    const [selectedTab, setSelectedTab] = React.useState("write");

    return (
        <div className="container">
            <ReactMde
                value={value}
                onChange={setValue}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(<ReactMarkdown source={markdown} />)
                }
            />
        </div>
    );
}