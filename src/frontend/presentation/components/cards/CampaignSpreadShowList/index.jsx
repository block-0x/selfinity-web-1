import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import { CAMPAIGN_MENU } from '@entity';
import { Enum, defineEnum } from '@extension/Enum';
import tt from 'counterpart';
import BorderInputRow from '@modules/BorderInputRow';
import GradationButton from '@elements/GradationButton';
import campaign_config from '@constants/campaign_config';
import Img from 'react-image';

class CampaignSpreadShowList extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
        url: '',
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'CampaignSpreadShowList'
        );
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.setState({
            section: defineEnum({
                Image: {
                    src: '/images/selfinity-logo.png',
                    ...CAMPAIGN_MENU.Image,
                },
                Title: {
                    text: tt('g.sns_spread_campaign'),
                    ...CAMPAIGN_MENU.Title,
                },
                Border: {
                    ...CAMPAIGN_MENU.Border,
                },
                Text: {
                    text: tt('g.sns_spread_campaign_desc', {
                        start: campaign_config.sns_spread_start,
                        end: campaign_config.sns_spread_end,
                    }),
                    ...CAMPAIGN_MENU.Text,
                },
                Custom: {
                    node: cmp => (
                        <div className="campaign-spread-show-list__custom">
                            <h2
                                style={{
                                    maxWidth: '220px',
                                    margin: '22px auto',
                                }}
                            >
                                {'応募説明・ルール'}
                            </h2>
                            <ul>
                                <li style={{ margin: '22px 25px' }}>
                                    {`下記のルールをすべてを満たしていれば1いいねに対して${
                                        campaign_config.reward_rate
                                    }Selfを差し上げます`}
                                    <ol>
                                        <li>
                                            {`サービスはTwitter・Facebook・Instagramのいずれかである`}
                                        </li>
                                        <li>
                                            {
                                                '「Selfinity」というハッシュタグが投稿に入ってる'
                                            }
                                        </li>
                                        <li>
                                            {
                                                '「Selfinity」という文字が投稿本文に入ってる'
                                            }
                                        </li>
                                        <li>
                                            {`いいね数は${
                                                campaign_config.like_min_limit
                                            }以上である`}
                                        </li>
                                    </ol>
                                </li>
                            </ul>

                            <form
                                className="campaign-spread-show-list__custom-input"
                                onSubmit={cmp.handleSubmit}
                            >
                                <div className="invite-show-list__form-item">
                                    <BorderInputRow
                                        value={cmp.state.url}
                                        onChange={cmp.onChangeUrl}
                                        title={tt('g.post') + 'URL'}
                                        ref={'url'}
                                        placeholder={tt('g.please_enter', {
                                            data: tt('g.post') + 'URL',
                                        })}
                                    />
                                </div>
                                <div className="invite-show-list__form-button">
                                    <GradationButton
                                        submit={true}
                                        value={tt('g.submit')}
                                        color={'blue'}
                                    />
                                </div>
                            </form>
                        </div>
                    ),
                    ...CAMPAIGN_MENU.Custom,
                },
            }),
        });
    }

    handleSubmit(e) {
        if (e) e.preventDefault();
    }

    onChangeUrl(e) {
        if (e) e.preventDefault();
        this.setState({
            url: e.target.value,
        });
    }

    render() {
        const { section } = this.state;

        const renderItem = items =>
            items._enums.map((item, index) => {
                switch (item.value) {
                    case CAMPAIGN_MENU.Image.value:
                        return (
                            <div
                                className="campaign-spread-show-list__image"
                                key={index}
                            >
                                <Img
                                    className="campaign-spread-show-list__image-src"
                                    src={item.src}
                                />
                            </div>
                        );
                    case CAMPAIGN_MENU.Title.value:
                        return (
                            <div
                                className="campaign-spread-show-list__title"
                                key={index}
                            >
                                {item.text}
                            </div>
                        );
                    case CAMPAIGN_MENU.Border.value:
                        return (
                            <div
                                className="campaign-spread-show-list__border"
                                key={index}
                            />
                        );
                    case CAMPAIGN_MENU.Text.value:
                        return (
                            <div
                                className="campaign-spread-show-list__text"
                                key={index}
                            >
                                {item.text}
                            </div>
                        );
                    case CAMPAIGN_MENU.Custom.value:
                        return (
                            <div
                                className="campaign-spread-show-list__custom"
                                key={index}
                            >
                                {item.node(this)}
                            </div>
                        );
                    default:
                        return <div key={index} />;
                        break;
                }
            });

        return (
            <div className="campaign-spread-show-list">
                {renderItem(section)}
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(CampaignSpreadShowList);
