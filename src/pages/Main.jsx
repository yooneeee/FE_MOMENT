import React from 'react'
import { styled } from 'styled-components'
import Card from '../components/Card'

function Main() {
    return (
        <>
            <div>
                <MainImg src='img/mainImg_test.jpeg'></MainImg>
            </div>

            <MainBody>
                <CardGroupName>
                    <CardName>
                        당신을 위한 맞춤 추천
                    </CardName>
                    <MoreButton>더보기</MoreButton>
                </CardGroupName>

                <CardContainer>
                  <Card/>   
                  <Card/>      
                  <Card/>                 
                </CardContainer>
            </MainBody>
        </>
    )
}

export default Main

const MainImg = styled.img`
    width: 100%;
`

const MainBody = styled.div`
    padding: 70px 90px;
`;

const CardGroupName = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
`

const CardName = styled.p`
    font-size: 20px;
    font-weight: 600;
`

const MoreButton = styled.div`
    border: none;
    color: #0096c6;
    cursor: pointer;
`

const CardContainer = styled.div`
    gap: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`
