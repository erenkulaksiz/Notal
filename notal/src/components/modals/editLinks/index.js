import { useEffect, useState } from 'react';
import URL from 'url-parse';
import { Button, Text, Modal, Input, Row } from '@nextui-org/react';

import LinkIcon from '../../../../public/icons/link.svg';
import CrossIcon from '../../../../public/icons/cross.svg';
import CheckIcon from '../../../../public/icons/check.svg';
import WebsiteIcon from '../../../../public/icons/website.svg';
import GithubIcon from '../../../../public/icons/github_2.svg';
import TwitterIcon from '../../../../public/icons/twitter.svg';
import InstagramIcon from '../../../../public/icons/instagram.svg';

const EditLinksModal = ({ visible, onClose, onEdit, links }) => {

    const [website, setWebsite] = useState(links.website);
    const [github, setGithub] = useState(links.github);
    const [twitter, setTwitter] = useState(links.twitter);
    const [instagram, setInstagram] = useState(links.instagram);

    useEffect(() => {
        setWebsite(links.website);
        setGithub(links.github);
        setTwitter(links.twitter);
        setInstagram(links.instagram);
    }, [links]);

    const [websiteError, setWebsiteError] = useState(false);

    const close = () => {
        onClose();
        setWebsiteError(false);
    }

    const onSubmit = () => {
        if (website.length != 0) {
            const parsedUrl = URL("https://" + website, {});
            if (parsedUrl.pathname != "/" || parsedUrl.query) {
                setWebsiteError("Please enter a website without a path (e.g. domain.com)");
                return;
            } else {
                setWebsiteError(false);
                if ((/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).test(website)) {
                    setWebsite(website);
                    setGithub(github);
                    setTwitter(twitter);
                    setInstagram(instagram);
                    onEdit({ website, github, twitter, instagram });
                } else {
                    setWebsiteError("Please enter a valid website. (e.g. domain.com)");
                    return;
                }
            }
        } else {
            setWebsiteError(false);
            setWebsite(website);
            setGithub(github);
            setTwitter(twitter);
            setInstagram(instagram);
            onEdit({ website, github, twitter, instagram });
        }
    }


    return (<Modal
        closeButton
        aria-labelledby="link-edit"
        open={visible}
        onClose={close}
    >
        <Modal.Header>
            <LinkIcon height={24} width={24} style={{ fill: "currentColor" }} />
            <Text b id="link-edit" size={18} css={{ ml: 4 }}>
                Edit Social Links
            </Text>
        </Modal.Header>
        <Modal.Body>
            <Row css={{ fd: "column" }}>
                <Input
                    clearable
                    bordered
                    fullWidth
                    labelLeft={<>
                        <WebsiteIcon height={24} width={24} style={{ fill: "currentColor", marginRight: 14 }} />
                        <Text css={{ color: "currentColor" }}>https://</Text>
                    </>}
                    color="primary"
                    placeholder="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    maxLength={25}
                />
                {websiteError != false && <Text color={"$error"}>{websiteError}</Text>}
            </Row>
            <Row>
                <Input
                    clearable
                    bordered
                    fullWidth
                    labelLeft={<GithubIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    color="primary"
                    placeholder="GitHub username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value.replace(/[^\w\s]/gi, '').replace(/\s/g, '').toLowerCase())}
                    maxLength={39}
                />
            </Row>
            <Row>
                <Input
                    clearable
                    bordered
                    fullWidth
                    labelLeft={<TwitterIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    color="primary"
                    placeholder="Twitter username"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value.replace(/[^\w\s]/gi, '').replace(/\s/g, '').toLowerCase())}
                    maxLength={15}
                />
            </Row>
            <Row>
                <Input
                    clearable
                    bordered
                    fullWidth
                    labelLeft={<InstagramIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    color="primary"
                    placeholder="Instagram username"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value.replace(/[^\w\s]/gi, '').replace(/\s/g, '').toLowerCase())}
                    maxLength={30}
                />
            </Row>
        </Modal.Body>
        <Modal.Footer css={{ justifyContent: "space-between" }}>
            <Button auto flat color="error" css={{ width: "46%" }} onClick={close}>
                <CrossIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Cancel
            </Button>
            <Button auto css={{ width: "46%" }} onClick={onSubmit}>
                <CheckIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                Edit
            </Button>
        </Modal.Footer>
    </Modal>)
}

export default EditLinksModal;