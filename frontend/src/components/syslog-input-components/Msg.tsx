import { ChangeEvent, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { validateTag, validateContent } from "../../SyslogValidator";
import "../../styles/RowSeparator.css";
import "../../styles/InputLabel.css";
import "../../styles/Fieldset.css";

interface TagProps {
  tag: string;
  setTag: (newTag: string) => void;
}

/*
 * Component representing Tag.
 *
 * Syslog tag represents the name of the app that spawned the message.
 * Result should not exceed 32 characters and should be terminated by a
 * non-alphanumeric character.
 *
 * Validation is not done here and is assumed to be done before sending the message.
 * */
function Tag({ tag, setTag }: TagProps) {
  const [validated, setValidated] = useState(false);
  const tooltip = (
    <Tooltip id="tag-tooltip">
      Represents the name of the application that spawned the message. <br />
      <br />
      Must contain exactly one non-alphanumeric character, be terminated by that
      character, and be at most 32 characters in total.
    </Tooltip>
  );

  // handler for "tag-input" textbox
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTag: string = event.target.value;
    setTag(newTag);
    if (!validateTag(newTag)) setValidated(false);
    else setValidated(true);
  };

  return (
    <Container id="tag-container">
      <Row className="row-separator">
        <Col>
          <Form.Group>
            <Form.Label htmlFor="tag-input" className="textbox-label">
              Tag:
            </Form.Label>
            <OverlayTrigger trigger="focus" overlay={tooltip} placement="right">
              <div>
                <Form.Control
                  id="tag-input"
                  type="text"
                  placeholder="MyApp:"
                  value={tag}
                  onChange={handleChange}
                  isInvalid={!validated}
                />
                <Form.Control.Feedback type="invalid">
                  Invalid format!
                </Form.Control.Feedback>
              </div>
            </OverlayTrigger>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

interface ContentProps {
  content: string;
  setContent: (newContent: string) => void;
}

/*
 * Represents the Content component
 *
 * Can be anything the user wants. Message should be detailed and clear. Although
 * an empty Content field is valid, RFC3164 warns this field being empty, so
 * the only stipulation is that the user cannot let this field be empty.
 * */
function Content({ content, setContent }: ContentProps) {
  const [validated, setValidated] = useState(false);
  const tooltip = (
    <Tooltip>
      Represents the details of the message. Should be descriptive and easy to
      understand.
    </Tooltip>
  );
  // Handler for "content-input" textbox
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newContent = event.target.value;
    setContent(newContent);

    if (!validateContent(newContent)) setValidated(false);
    else setValidated(true);
  };

  return (
    <Container id="content-container">
      <Row className="row-separator">
        <Col>
          <Form.Group>
            <Form.Label htmlFor="content-input" className="textbox-label">
              Content:
            </Form.Label>
            <OverlayTrigger trigger="focus" overlay={tooltip} placement="right">
              <div>
                <Form.Control
                  type="text"
                  id="content-input"
                  placeholder="Something went wrong!"
                  value={content}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleChange(event)
                  }
                  isInvalid={!validated}
                />
                <Form.Control.Feedback></Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  Cannot be empty!
                </Form.Control.Feedback>
              </div>
            </OverlayTrigger>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

interface SeparateMsgWithSpaceCheckboxProps {
  separateWithSpace: boolean;
  setSeparateWithSpace: (option: boolean) => void;
}

function SeparateMsgWithSpaceCheckbox({
  separateWithSpace,
  setSeparateWithSpace,
}: SeparateMsgWithSpaceCheckboxProps) {
  // handler for checkbox
  const handleChange = () => setSeparateWithSpace(!separateWithSpace);

  return (
    <Container>
      <Row>
        <Col>
          <input
            type="checkbox"
            id="separate-with-space-checkbox"
            checked={separateWithSpace}
            onChange={handleChange}
          />
          <label
            htmlFor="separate-with-space-checkbox"
            className="checkbox-label"
          >
            Separate Tag and Content with space
          </label>
        </Col>
      </Row>
    </Container>
  );
}

export { Tag, Content, SeparateMsgWithSpaceCheckbox };

interface MsgProps
  extends TagProps,
  ContentProps,
  SeparateMsgWithSpaceCheckboxProps { }

export default function Msg({
  tag,
  setTag,
  content,
  setContent,
  separateWithSpace,
  setSeparateWithSpace,
}: MsgProps) {
  return (
    <fieldset>
      <legend>Msg</legend>
      <Tag tag={tag} setTag={setTag} />
      <Content content={content} setContent={setContent} />
      <SeparateMsgWithSpaceCheckbox
        separateWithSpace={separateWithSpace}
        setSeparateWithSpace={setSeparateWithSpace}
      />
    </fieldset>
  );
}
